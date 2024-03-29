import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Notification, NotificationScreenProp } from '../../../types/types';
import { URL, VERSION } from '@env';
import { Colors, Drawer, ListItem, Text } from 'react-native-ui-lib';
import CustomImage from '../../../components/CustomImage';
import { formatDistanceToNowStrict } from 'date-fns';
import { useAppSelector } from '../../../hooks/hooks';
import { useLogout } from '../../../hooks/useLogout';
import { useInfiniteQuery } from '@tanstack/react-query';

const NotificationScreen = ({ navigation }: NotificationScreenProp) => {
    const refArray = useRef<any>([]);
    let lastIndex: any = undefined;
    const user = useAppSelector((state) => state.user.value);
    const { logout } = useLogout();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchNotifications = async ({ pageParam }: { pageParam: number }) => {
        const response = await fetch(`${URL}/api/${VERSION}/notification/getNotifications?page=${pageParam}&limit=25`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
        })
        const json = await response.json()
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
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
    })

    const closeLast = (index: any) => {
        if (lastIndex !== undefined && lastIndex !== index) {
            closeDrawer(lastIndex);
        }
        lastIndex = index;
    }

    const onSwipeableWillOpen = (props: any) => {
        closeLast(props.index);
    }

    const closeDrawer = (index: any) => {
        refArray.current[index].closeDrawer();
    }

    const addRef = (ref: any, index: any) => {
        refArray.current[index] = ref;
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

    return (
        <FlatList
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
            }
            style={styles.container}
            data={data?.pages.flatMap(page => page)}
            renderItem={({ item, index }) => (
                <NotificationItem item={item}
                    index={index}
                    addRef={addRef}
                    onSwipeableWillOpen={onSwipeableWillOpen}
                    navigation={navigation} />
            )}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
        />
    )
}

export default NotificationScreen

type NotificationItemProp = {
    item: Notification,
    index: number,
    addRef: () => void,
    onSwipeableWillOpen: () => void,
}

const NotificationItem = ({ item, index, addRef, onSwipeableWillOpen, navigation }: NotificationItemProp & NotificationScreenProp) => {
    const rightButtons = [
        {
            icon: require('../../../assets/delete.png'),
            text: 'Delete',
            background: Colors.red30,
            testID: 'right_item_delete',
            onPress: () => Alert.alert(`Delete?`)
        }
    ];

    const onPress = () => {
        if (item.data.type === "notification") {
            navigation.navigate('NotificationDetails', { notification: item })
        } else if (item.data.type === 'newEvent' || item.data.type === 'liveStream') {
            navigation.navigate('CalendarEventDetails', { event: item.data.event })
        }
    }

    return (
        <Drawer
            // leftItem={item.leftButton}
            rightItems={rightButtons}
            fullSwipeRight={false}
            // itemsMinWidth={80}
            ref={r => addRef(r, index)}
            index={index} // sent for the 'closeLast' functionality
            onSwipeableWillOpen={onSwipeableWillOpen} // sent for the 'closeLast' functionality
        >
            <ListItem
                height={75.8}
                onPress={onPress}
            >
                <ListItem.Part left>
                    <CustomImage style={styles.avatar} uri={item?.club?.avatar} />
                </ListItem.Part>
                <ListItem.Part middle column containerStyle={styles.border}>
                    <ListItem.Part containerStyle={styles.middle}>
                        <Text style={styles.text} text70BO color={Colors.grey10} numberOfLines={1}>{item.club.name}</Text>
                        <Text style={styles.subtitle} text90 color={Colors.grey40}>{formatDistanceToNowStrict(item.createdAt)} ago</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={styles.text} text80 color={Colors.grey10} numberOfLines={1}>{item.body}</Text>
                        {/* {item.count > 0 && <Button size={'small'} label={item.count} onPress={item.buttonPress} />} */}
                    </ListItem.Part>
                </ListItem.Part>
            </ListItem>
        </Drawer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey70,
        paddingRight: 17
    },
    avatar: {
        marginHorizontal: 18,
        width: 54,
        height: 54,
        borderRadius: 50,
    },
    middle: {
        marginBottom: 3
    },
    text: {
        flex: 1,
        marginRight: 10
    },
    subtitle: {
        marginTop: 2
    }
})