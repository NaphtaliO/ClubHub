import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Card } from 'react-native-ui-lib';
import CustomImage from './CustomImage';
import { formatDistanceToNowStrict } from 'date-fns';
import CustomText from './CustomText';
import { Icon } from '@rneui/themed';
import { PostProp, StudentHomeScreenProps } from '../types/types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { URL, VERSION } from '@env';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '../hooks/hooks';
import { useLogout } from '../hooks/useLogout';
import { Video } from 'expo-av';
import CustomVideo from './CustomVideo';

type Prop = {
    item: PostProp,
    refetch: () => void,
    onVideoRef: (video: RefObject<Video>) => void,
}

const StudentViewPost = ({ item, refetch, navigation, onVideoRef }: Prop & StudentHomeScreenProps) => {
    const user = useAppSelector((state) => state.user.value);
    const { showActionSheetWithOptions } = useActionSheet();
    const { logout } = useLogout();
    const [status, setStatus] = useState({});
    const video = useRef<any>(null);

    useEffect(() => {
        if (onVideoRef && typeof onVideoRef === 'function') {
            onVideoRef(video);
        }
    }, [onVideoRef, video]);

    const vibrateOnSuccess = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

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
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                refetch();
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const bottomSheet = () => {
        showActionSheetWithOptions({
            options: ["Cancel", "Delete"],
            cancelButtonIndex: 0,
            destructiveButtonIndex: 1
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case 0:
                    // Cancel
                    break;
                case 1:
                    // deletePostUI(item._id, item.uri);
                    break;
            }
        });
    }

    return (
        <Card style={{ margin: 6 }}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                    {/* avatar */}
                    <View style={{ flexDirection: 'row' }}>
                        <View
                            accessible={true}
                            accessibilityLabel="Post author's Image"
                            accessibilityHint="This is the profile image of the author">
                            {!item.club.avatar ?
                                <Image style={styles.avatar} source={require('../assets/default_avatar.png')} />
                                : <CustomImage uri={item.club.avatar} style={styles.avatar} />}
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={styles.name} accessibilityLabel={`Club name. ${item?.club?.name} `}>{item.club.name}</Text>
                            <Text style={styles.timestamp} accessibilityLabel={`Timestamp. Post was created. ${formatDistanceToNowStrict(new Date(item?.createdAt))} ago`}>
                                {`${formatDistanceToNowStrict(new Date(item.createdAt))} ago`}
                            </Text>
                        </View>
                    </View>
                    {/* Three Dots on the Right */}
                    {/* <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={bottomSheet}>
                        <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                    </TouchableOpacity> */}
                </View>
                {/* caption */}
                <View
                    accessible
                    accessibilityLabel={`Post's caption. ${item?.caption}`}
                >
                    <CustomText style={styles.caption} caption={item.caption} />
                </View>
            </View>
            <View style={{ marginTop: 10 }}
                accessible={true}
                accessibilityHint="Post's media content. Image or Video">
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
                }}
                    accessible={true}
                    accessibilityLabel={`Like post button. This post has ${item.likes.length} like${item.likes.length === 1 ? '' : 's'}`}
                    accessibilityHint="Click this button to like this post"
                >
                    <TouchableOpacity onPress={like}>
                        <Icon
                            style={{ marginRight: 7 }}
                            size={25}
                            name={item?.likes?.includes(`${user?._id}`) ? 'heart' : 'heart-outline'}
                            type={'material-community'}
                            color={item?.likes?.includes(`${user?._id}`) ? 'red' : ''}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.likes.length}</Text>
                </View>

                <View style={{
                    marginVertical: 15,
                    paddingLeft: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                    accessible={true}
                    accessibilityLabel={`Comment post button. This post has ${item.comments.length} comment${item.comments.length === 1 ? '' : 's'}`}
                    accessibilityHint="Click this button to Comment on this post"
                >
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

export default StudentViewPost;

const styles = StyleSheet.create({
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
})