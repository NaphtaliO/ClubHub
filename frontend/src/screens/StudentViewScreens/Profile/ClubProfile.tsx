import _ from 'lodash';
import { ActivityIndicator, Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { Button, Divider, Layout, Text } from '@ui-kitten/components';
import { ProfileSocial } from '../../../components/profile-social.component';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import { ClubProfileScreen, Club, PostProp, chatClient } from '../../../types/types';
import { Assets, Card, Colors, TabController, TabControllerImperativeMethods, TabControllerItemProps, View } from 'react-native-ui-lib';
import { logIn } from '../../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomImage from '../../../components/CustomImage';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomText from '../../../components/CustomText';
import CustomVideo from '../../../components/CustomVideo';
import { Icon } from '@rneui/themed';
import { formatDistanceToNowStrict } from 'date-fns';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Video } from 'expo-av';
import { useAppContext } from '../../../context/AppContext';
import type {
    Channel as StreamChatChannel,
} from 'stream-chat';
import ListEmpty from '../../../components/ListEmpty';
import * as WebBrowser from 'expo-web-browser';

const { height, width } = Dimensions.get('window');

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
};

const ClubProfile = ({ route, navigation }: ClubProfileScreen) => {
    const { id } = route.params;
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.value);
    const [club, setClub] = useState<Club>();
    const { logout } = useLogout();
    const dispatch = useAppDispatch();
    const cellRefs = useRef<any>({});

    const [asCarousel, setAsCarousel] = useState(true);
    const [centerSelected, setCenterSelected] = useState<boolean>(false);
    const [fewItems, setFewItems] = useState<boolean>(false);
    const [initialIndex, setInitialIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [key, setKey] = useState(Date.now());
    const tabController = React.createRef<TabControllerImperativeMethods>();
    const { setChannel } = useAppContext();
    const currentChannel = useRef<StreamChatChannel>();
    const isDraft = useRef(true);

    const TABS = ['Home', 'Posts'];

    const generateTabItems = (fewItems: any): TabControllerItemProps[] => {
        // @ts-expect-error
        const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, fewItems ? 2 : TABS.length),
            (tabs: TabControllerItemProps[]) =>
                _.map<TabControllerItemProps>(tabs, (tab: TabControllerItemProps, index: number) => ({
                    label: tab,
                    key: tab,
                    icon: index === 2 ? <Text>hi</Text> : undefined,
                    badge: index === 5 ? { label: '2' } : undefined,
                    leadingAccessory: index === 3 ? <Text marginR-4>{Assets.emojis.movie_camera}</Text> : undefined,
                    trailingAccessory: index === 4 ? <Text marginL-4>{Assets.emojis.camera}</Text> : undefined
                })))(TABS);

        return fewItems ? items : [...items];
    };

    const [items, setItems] = useState(generateTabItems(false));

    const getClubProfile = async () => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/user/getClubProfile/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
                // Alert.alert(`${json.message}`, '', [
                //     { text: 'OK', onPress: () => navigation.goBack() },
                // ]);
            }
            if (response.ok) {
                setClub(json.profile);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
        const res = await fetch(`${URL}/api/${VERSION}/post/getClubProfilePosts/${id}?page=${pageParam}&limit=10`, {
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
        queryKey: ['clubProfileFeed'],
        queryFn: fetchProjects,
        initialPageParam: 0,
        gcTime: 86400000, // 24hrs in miliseconds
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

    const joinClub = async () => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/user/joinClub/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setClub(json.club);
                const updatedUser = { ...json.student, token: user?.token };
                dispatch(logIn(updatedUser));
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    useEffect(() => {
        setLoading(true);
        getClubProfile();
        setLoading(false);
    }, [])

    const onRefresh = () => {
        setRefreshing(true);
        getClubProfile();
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
                    cell?.current?.playAsync()
                    // console.log("play");
                } else if (!item.isViewable) {
                    cell?.current?.pauseAsync();
                    // console.log("pause");
                }
            }
        });
    };

    const message = async () => {
        if (!chatClient?.user?.id) {
            return;
        }

        const members = [chatClient.user.id, id];
        // Check if the channel already exists.
        const channels = await chatClient.queryChannels({
            distinct: true,
            members,
        });

        if (channels.length === 1) {
            // Channel already exist
            currentChannel.current = channels[0];
            isDraft.current = false;
        } else {
            // Channel doesn't exist.
            isDraft.current = true;
            const channel = chatClient.channel('messaging', {
                members,
            });

            // Hack to trick channel component into accepting channel without watching it.
            channel.initialized = true;
            currentChannel.current = channel;
        }

        try {
            if (!id || !currentChannel.current) {
                throw new Error('Missing user or current channel');
            }

            if (isDraft.current) {
                currentChannel.current.initialized = false;
                await currentChannel.current.create();
            }

            if (currentChannel.current.id) {
                await setChannel(currentChannel.current);
                // navigation.replace('Main', { screen: 'Channel' });
                navigation.navigate('StudentChannel')
            }
        } catch (error) {
            console.log((error as Error));
        }
    }

    return (
        <FlatList
            ListHeaderComponent={
                <View>
                    <Layout level='2' >
                        <Layout style={styles.header} level='1'>
                            <View style={styles.profileContainer}>
                                {club?.avatar ? <CustomImage style={styles.profileAvatar} uri={`${club?.avatar}`} />
                                    :
                                    <Image
                                        style={styles.profileAvatar}
                                        source={require('../../../assets/default_avatar.png')}
                                    />}
                                <View style={styles.profileDetailsContainer}>
                                    <Text category='h4'>{club?.name}</Text>
                                    <Text appearance='hint' category='s1'>{club?.location}</Text>
                                    {/* <RateBar
                                        style={styles.rateBar}
                                        hint='Experience'
                                        value={rating}
                                        onValueChange={setRating}
                                        /> */}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                {/* <Button
                                    style={styles.followButton}
                                    onPress={joinClub}>
                                    {loading ? (<ActivityIndicator size={'large'} color={'white'} />)
                                        : club?.members.includes(`${user?._id}`) ? 'LEAVE' : 'JOIN'}
                                </Button> */}
                                <TouchableOpacity onPress={joinClub}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.button}>
                                            {club?.members.includes(`${user?._id}`) ? 'Leave' : 'Join'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={message}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.button}>Message</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* <RNPButton mode="contained"
                        style={styles.followButton}
                        onPress={() => { }}
                        loading={loading}>
                        {club?.members.includes(user._id)}
                    </RNPButton> */}
                            <Text
                                style={styles.descriptionText}
                                appearance='hint'>
                                {club?.bio}
                            </Text>
                            {club?.website ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Feather name="link" size={15} color="black" style={{ paddingRight: 5 }} />
                                    <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(club.website)} >
                                        <Text style={{ color: '#2155CD' }} numberOfLines={1}>{club.website}</Text>
                                    </TouchableOpacity>
                                </View>
                                : null}
                            <View style={styles.profileParametersContainer}>
                                <View style={styles.profileSocialsSection}>
                                    <ProfileSocial
                                        style={styles.profileSocialContainer}
                                        hint='Members'
                                        value={`${club?.members.length}`}
                                    />
                                </View>
                                <Divider style={styles.profileSectionsDivider} />
                                <View style={styles.profileParametersSection}>
                                    <ProfileSocial
                                        style={styles.profileSocialContainer}
                                        hint='Rank'
                                        value={`1`}
                                    />
                                </View>
                            </View>
                        </Layout>
                    </Layout>
                </View>
            }
            style={styles.container}
            // ref={flatListRef}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
            }
            data={data?.pages.flatMap(page => page)}
            renderItem={({ item }) => (
                <Post item={item} refetch={refetch} onVideoRef={(videoRef) => {
                    cellRefs.current[item._id] = videoRef.current;
                    // console.log(videoRef);
                }} navigation={navigation} />
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
            ListEmptyComponent={<ListEmpty title='Posts appear here'
                message='This club/society has no posts' />}
        />
    )
}

export default ClubProfile;

const Post = ({ item, refetch, onVideoRef, navigation }:
    {
        item: PostProp,
        refetch: () => void,
        onVideoRef: (video: RefObject<Video>) => void,
    }) => {
    const user = useAppSelector(state => state.user.value);
    const video = useRef<any>(null);
    const [status, setStatus] = useState({});

    const like = async () => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/post/like/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            const json = await response.json()
            if (!response.ok) {
                // if (json.error === "Request is not authorized") {
                //     logout()
                // }
            }
            if (response.ok) {
                refetch();
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    useEffect(() => {
        if (onVideoRef && typeof onVideoRef === 'function') {
            onVideoRef(video);
        }
    }, [onVideoRef, video]);

    return (
        <Card style={{ margin: 6 }}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                    {/* avatar */}
                    <View style={{ flexDirection: 'row' }}>
                        {!item?.club?.avatar ?
                            <Image style={styles.avatar} source={require('../../../assets/default_avatar.png')} />
                            : <CustomImage uri={item?.club.avatar} style={styles.avatar} />}
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={styles.name}>{item?.club?.name}</Text>
                            <Text style={styles.timestamp}>{`${formatDistanceToNowStrict(new Date(item?.createdAt))} ago`}</Text>
                        </View>
                    </View>
                    {/* Three Dots on the Right */}
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => { }}>
                        <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {/* caption */}
                <CustomText style={styles.caption} caption={item?.caption} />
            </View>
            <View style={{ marginTop: 10 }}>
                {/* Media  */}
                {!item?.uri ? null : item?.type === "image" ?
                    <CustomImage uri={item?.uri} style={styles.image} /> : item?.type === "video" ?
                        <CustomVideo
                            style={styles.image}
                            uri={item?.uri}
                            status={status}
                            setStatus={setStatus}
                            onVideoRef={(ref) => video.current = ref}
                        />
                        : null}
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{
                    marginVertical: 15,
                    paddingLeft: 15,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={like}>
                        <Icon
                            style={{ marginRight: 7 }}
                            size={25}
                            name={item.likes.includes(`${user?._id}`) ? 'heart' : 'heart-outline'}
                            type={'material-community'}
                            color={item.likes.includes(`${user?._id}`) ? 'red' : ''}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.likes.length}</Text>
                </View>

                <View style={{
                    marginVertical: 15,
                    paddingLeft: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('StudentCommentsScreen', { post_id: item._id, refetch: refetch })}>
                        <Icon
                            style={{ marginRight: 7 }}
                            size={23}
                            name={'comment-outline'}
                            type={'material-community'}
                            color={''}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.comments.length}</Text>
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
    },
    profileAvatar: {
        marginHorizontal: 8,
        width: 65,
        height: 65,
        borderRadius: 50
    },
    profileDetailsContainer: {
        flex: 1,
        marginHorizontal: 8,
    },
    rateBar: {
        marginTop: 24,
    },
    followButton: {
        marginTop: 24,
    },
    descriptionText: {
        marginTop: 24,
        marginBottom: 8,
    },
    profileParametersContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 8,
        justifyContent: 'space-evenly',
    },
    profileSectionsDivider: {
        width: 1,
        height: '100%',
        marginHorizontal: 8,
    },
    profileSocialsSection: {
        marginHorizontal: 16,
    },
    profileSocialContainer: {
        flex: 1,
    },
    profileParametersSection: {
        // flex: 1,
        marginHorizontal: 16,
    },
    profileParameter: {
        marginBottom: 16,
    },
    labelStyle: {
        fontSize: 16
    },
    selectedLabelStyle: {
        fontSize: 16
    },
    avatar: {
        borderRadius: 50,
        width: 50,
        height: 50,
        marginRight: 15
    },
    name: {
        fontWeight: '700',
    },
    timestamp: {
        fontSize: 13,
        color: '#606470'
    },
    caption: {
        letterSpacing: 1.2,
        fontSize: 15,
        fontWeight: '400',
    },
    image: {
        width: '100%',
        aspectRatio: 4 / 3
    },
    buttonContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'center',
        marginTop: 30,
        paddingHorizontal: 50,
        backgroundColor: '#3AB0FF',
        borderRadius: 10,
        width: '100%',
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    },
});