import { ActivityIndicator, Dimensions, FlatList, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StudentHomeScreenProps, chatClient } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import StudentViewPost from '../../../components/StudentViewPost';
import { LIVESTREAMAPIKEY, URL, VERSION } from '@env';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLogout } from '../../../hooks/useLogout';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useAppContext } from '../../../context/AppContext';
import { StreamVideoClient, StreamVideoRN } from '@stream-io/video-react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListEmpty from '../../../components/ListEmpty';

const { height, width } = Dimensions.get('window');

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

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
    // token = (await Notifications.getDevicePushTokenAsync());
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId
    })
    // console.log(token);
    
  } else {
    // alert('Must use physical device for Push Notifications');
    return;
  }

  return token;
}


messaging().setBackgroundMessageHandler(async remoteMessage => {
  // handle the message
  const message = await chatClient.getMessage(remoteMessage.data.id);

  // create the android channel to send the notification to
  const channelId = await notifee.createChannel({
    id: 'chat-messages',
    name: 'Chat Messages',
  });

  // display the notification
  const { stream, ...rest } = remoteMessage.data ?? {};
  const data = {
    ...rest,
    ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
  };
  await notifee.displayNotification({
    title: 'New message from ' + message.message.user.name,
    body: message.message.text,
    data,
    android: {
      channelId,
      // add a press action to open the app on press
      pressAction: {
        id: 'default',
      },
    },
  });
});

const Home = ({ navigation }: StudentHomeScreenProps) => {
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { logout } = useLogout();
  const cellRefs = useRef<any>({});
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { setChannel } = useAppContext();

  const setPushToken = async (token: Notifications.ExpoPushToken | undefined) => {
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
      setPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {     
      let data = response.notification.request.content;

      if (data.data.type === "notification") {
        navigation.navigate('NotificationDetails', { notification: data })
      } else if (data.data.type === 'newEvent' || data.data.type === 'liveStream') {
        navigation.navigate('CalendarEventDetails', { event: data.data.event })
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    // add listener to notifications received when on foreground
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      const message = await chatClient.getMessage(remoteMessage.data.id);

      // create the android channel to send the notification to
      const channelId = await notifee.createChannel({
        id: 'chat-messages',
        name: 'Chat Messages',
      });

      // display the notification
      const { stream, ...rest } = remoteMessage.data ?? {};
      const data = {
        ...rest,
        ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
      };
      await notifee.displayNotification({
        title: 'New message from ' + message.message.user.name,
        body: message.message.text,
        data,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    // add listener to user interactions on foreground notifications
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(async ({ detail, type }) => {
      if (type === EventType.PRESS) {
        // user has pressed notification
        const channelId = detail.notification?.data?.channel_id;
        // The navigation logic, to navigate to relevant channel screen.
        if (channelId) {
          const newChannel = chatClient.channel('messaging', `${channelId}`)
          await newChannel.watch();
          setChannel(newChannel);
          navigation.navigate('StudentChannel');
        }
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeForegroundEvent();
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
    if (!res.ok) {
      if (json.error === "Request is not authorized") {
        logout()
      }
    }
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
    gcTime: 86400000, // 24hrs in miliseconds
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
  })

  if (error) {
    console.log(error);
  }

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

  const _onViewableItemsChanged = (props: any) => {
    const changed = props.changed;
    changed.forEach((item: any) => {
      const cell = cellRefs.current[item.item._id];
      if (cell) {
        if (item.isViewable) {
          // console.log(item.index);
          cell.current?.playAsync()
          // console.log("play");
        } else if (!item.isViewable) {
          cell.current?.pauseAsync();
          // console.log("pause");
        }
      }
    });
  };

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
        renderItem={({ item }) => (
          <StudentViewPost onVideoRef={(videoRef) => {
            cellRefs.current[item._id] = videoRef.current;
            // console.log(videoRef);
          }} item={item} refetch={refetch} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onViewableItemsChanged={_onViewableItemsChanged}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        getItemLayout={(_data, index) => ({
          length: cellHeight,
          offset: cellHeight * index,
          index,
        })}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <ListEmpty title='Welcome to ClubHub'
            message='Join clubs/societies to populate your feed' />}
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