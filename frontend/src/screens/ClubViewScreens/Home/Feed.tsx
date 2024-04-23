import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ClubViewPost from '../../../components/ClubViewPost';
import { useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import { chatClient, ClubHomeScreenProps, PostProp } from '../../../types/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { useAppContext } from '../../../context/AppContext';
import { useLogout } from '../../../hooks/useLogout';

const { height, width } = Dimensions.get('window');

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const Feed = ({ navigation }: ClubHomeScreenProps) => {
  const [posts, setPosts] = useState<PostProp[]>([]);
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const cellRefs = useRef<any>({});
  const { setChannel } = useAppContext();
  const { logout } = useLogout();

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
          navigation.navigate('ClubChannel');
        }
      }
    });

    notifee.onBackgroundEvent(async ({ detail, type }) => {
      if (type === EventType.PRESS) {
        // user press on notification detected while app was on background on Android
        const channelId = detail.notification?.data?.channel_id;
        if (channelId) {
          const newChannel = chatClient.channel('messaging', `${channelId}`)
          await newChannel.watch();
          setChannel(newChannel);
          navigation.navigate('ClubChannel');
        }
        await Promise.resolve();
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeForegroundEvent();
    };
  }, []);

  useEffect(() => {
    const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp(async (remoteMessage) => {
      // Notification caused app to open from background state on iOS
      const channelId = remoteMessage.data?.channel_id;
      // The navigation logic, to navigate to relevant channel screen.
      if (channelId) {
        const newChannel = chatClient.channel('messaging', `${channelId}`)
        await newChannel.watch();
        setChannel(newChannel);
        navigation.navigate('ClubChannel');
      }
    });

    notifee.getInitialNotification().then(async (initialNotification) => {
      if (initialNotification) {
        // Notification caused app to open from quit state on Android
        const channelId = initialNotification.notification.data?.channel_id;
        // Start the app with the relevant channel screen.
        const newChannel = chatClient.channel('messaging', `${channelId}`)
        await newChannel.watch();
        setChannel(newChannel);
      }
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          // Notification caused app to open from quit state on iOS
          const channelId = remoteMessage.data?.channel_id;
          // Start the app with the relevant channel screen.
          const newChannel = chatClient.channel('messaging', `${channelId}`)
          await newChannel.watch();
          setChannel(newChannel);
        }
      });

    return () => {
      unsubscribeOnNotificationOpen();
    };
  }, []);


  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(`${URL}/api/${VERSION}/post/getPostsByClub?page=${pageParam}&limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
    })
    const json = await res.json()
    if (!res.ok) {
      if (json.error === "Request is not authorized") {
        logout();
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
    refetch
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    gcTime: 86400000, // 24hrs in miliseconds
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
  });

  if (error) {
    console.log(error);
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

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
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

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        data={data?.pages.flatMap(page => page)}
        renderItem={({ item, index }) => (
          <ClubViewPost onVideoRef={(videoRef) => {
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
      />
    </View>
  )
}

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})