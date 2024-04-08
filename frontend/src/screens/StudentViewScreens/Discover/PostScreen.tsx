import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/themed';
import CustomImage from '../../../components/CustomImage';
import { useAppSelector } from '../../../hooks/hooks';
import { PostProp, PostScreenProp } from '../../../types/types';
import { URL, VERSION } from '@env';
import { Card } from 'react-native-ui-lib';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomText from '../../../components/CustomText';
import { formatDistanceToNowStrict } from 'date-fns';

const PostScreen = ({ route, navigation }: PostScreenProp) => {
    const [post, setPost] = useState(route.params.post);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Post item={post} navigation={navigation} setPost={setPost} />
        </ScrollView>

    )
}

export default PostScreen

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

const Post = ({ item, navigation, setPost }:
    {
        item: PostProp,
        navigation: any,
        setPost: (post: PostProp) => void
    }) => {
    const user = useAppSelector(state => state.user.value);
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
                setPost({ ...item, likes: json.likes })
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    return (
        <Card style={{ margin: 6 }}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                    {/* avatar */}
                    <TouchableWithoutFeedback onPress={() => navigation.push('ClubProfile', { name: item.club.name, id: item.club._id })}>
                        <View style={{ flexDirection: 'row' }}>
                            {!item?.club?.avatar ?
                                <Image style={styles.avatar} source={require('../../../assets/default_avatar.png')} />
                                : <CustomImage uri={item?.club.avatar} style={styles.avatar} />}
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={styles.name}>{item?.club?.name}</Text>
                                <Text style={styles.timestamp}>{`${formatDistanceToNowStrict(new Date(item?.createdAt))} ago`}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* Three Dots on the Right */}
                    {/* <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => { }}>
                        <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                    </TouchableOpacity> */}
                </View>
                {/* caption */}
                <CustomText style={styles.caption} caption={item?.caption} />
            </View>
            <View style={{ marginTop: 10 }}>
                {/* Media  */}
                {!item?.uri ? null : item?.type === "image" ?
                    <CustomImage uri={item?.uri} style={styles.image} /> : item?.type === "video" ?
                        null
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
                    <TouchableOpacity onPress={() => navigation.navigate('StudentCommentsScreen', { post_id: item._id, refetch: () => { } })}>
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