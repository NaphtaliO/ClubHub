import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Card } from 'react-native-ui-lib';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomImage from './CustomImage';
import { formatDistanceToNowStrict } from 'date-fns';
import CustomText from './CustomText';
import { Icon } from '@rneui/themed';
import { PostProp } from '../types/types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { URL, VERSION } from '@env';
import { useAppSelector } from '../hooks/hooks';
import { useLogout } from '../hooks/useLogout';
import { Video } from 'expo-av';
import CustomVideo from './CustomVideo';

type Prop = {
    item: PostProp,
    refetch: () => void,
    navigation: any,
    onVideoRef: (video: RefObject<Video>) => void,
}

const ClubViewPost = ({ item, refetch, navigation, onVideoRef }: Prop) => {
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

    const deleteFromFirebase = async (url: string) => {
        if (url === null || url === "") {
            null
        } else {
            try {
                let pictureRef = ref(getStorage(), url);
                await deleteObject(pictureRef).then(() => {
                    console.log("Deletion Successful");
                })
            } catch (error) {
                console.log((error as Error).message);
            }
        }
    }

    const deletePostUI = async (id: string, uri: string) => {
        Alert.alert('Delete this post?', '', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            {
                text: 'Delete', style: 'default', onPress: async () => {
                    try {
                        const response = await fetch(`${URL}/api/${VERSION}/post/deletePost/${id}`, {
                            method: 'DELETE',
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
                            await deleteFromFirebase(uri)
                            refetch();
                        }
                    } catch (error) {
                        console.log((error as Error).message);
                    }
                }
            }
        ])
    };

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
                    deletePostUI(item._id, item.uri);
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
                        {!item?.club?.avatar ?
                            <Image style={styles.avatar} source={require('../assets/default_avatar.png')} />
                            : <CustomImage uri={item?.club.avatar} style={styles.avatar} />}
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={styles.name}>{item?.club?.name}</Text>
                            <Text style={styles.timestamp}>{`${formatDistanceToNowStrict(new Date(item?.createdAt))} ago`}</Text>
                        </View>
                    </View>
                    {/* Three Dots on the Right */}
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={bottomSheet}>
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
                    {/* TODO: Introduce like animations
                https://dev.to/vcapretz/instagram-like-button-in-react-native-and-reanimated-v2-3h3k
                */}
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.likes.length}</Text>
                </View>

                <View style={{
                    marginVertical: 15,
                    paddingLeft: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ClubCommentsScreen', { post_id: item._id, refetch: refetch })}>
                        <Icon
                            style={{ marginRight: 7 }}
                            size={23}
                            name={'comment-outline'}
                            type={'material-community'}
                            color={''}
                        />
                    </TouchableOpacity>
                    {/* TODO: Introduce like animations
                https://dev.to/vcapretz/instagram-like-button-in-react-native-and-reanimated-v2-3h3k
                */}
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.comments.length}</Text>
                </View>
            </View>
        </Card>
    )
}

export default ClubViewPost;

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