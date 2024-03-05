import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Subscription } from 'expo-modules-core';
import { PostProp, StudentHomeScreenProps } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import StudentViewPost from '../../../components/StudentViewPost';
import { URL, VERSION } from '@env';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLogout } from '../../../hooks/useLogout';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getDevicePushTokenAsync());
  } else {
    // alert('Must use physical device for Push Notifications');
    return;
  }

  return token;
}

const Home = ({ navigation }: StudentHomeScreenProps) => {
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { logout } = useLogout();
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const setPushToken = async (token: Notifications.DevicePushToken | undefined) => {
    if (!token) return;
    try {
      const response = await fetch(`${URL}/api/${VERSION}/user/setPushToken`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      const json = await response.json()
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        console.log(json);
        
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log(token);
      setPushToken(token);
      // dispatch(setToken(token))
    });
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      let data = response.notification.request.content.data;
      console.log(data);
      
      // if (data.type === "following") {
      //   navigation.push('UserProfileScreen', { username: data.username, id: data.id })
      // } else if (data.type === "comment") {
      //   navigation.push("CommentsScreen", { post_id: data.post_id })
      // } else if (data.type === "liked") {
      //   navigation.push("LikesScreen", { post_id: data.post_id })
      // }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(`${URL}/api/${VERSION}/post/getStudentsFeed?page=${pageParam}&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
    })
    const json = await res.json()
    return json
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
  })

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <ActivityIndicator size='small' color='black' />
    }
  }

  // const scrollToTop = () => {
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  //   }
  // };

  return (
    <View style={styles.container}>
      <FlatList
        // ref={flatListRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        data={data?.pages.flatMap(page => page)}
        renderItem={({ item }) => <StudentViewPost item={item} refetch={refetch} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})