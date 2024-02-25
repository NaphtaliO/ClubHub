import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
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

type Prop = {
    item: PostProp,
    // setPosts: (arg: PostProp[]) => void,
    // posts: PostProp[]
}

const StudentViewPost = ({ item }: Prop) => {
    const user = useAppSelector((state) => state.user.value);
    const [liked, setLiked] = useState<boolean>(false);
    const { showActionSheetWithOptions } = useActionSheet();
    const { logout } = useLogout();

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
                        {!item.club.avatar ?
                            <Image style={styles.avatar} source={require('../assets/default_avatar.png')} />
                            : <CustomImage uri={item.club.avatar} style={styles.avatar} />}
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={styles.name}>{item.club.name}</Text>
                            <Text style={styles.timestamp}>{`${formatDistanceToNowStrict(new Date(item.createdAt))} ago`}</Text>
                        </View>
                    </View>
                    {/* Three Dots on the Right */}
                    {/* <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={bottomSheet}>
                        <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                    </TouchableOpacity> */}
                </View>
                {/* caption */}
                <CustomText style={styles.caption} caption={item.caption} />
            </View>
            <View style={{ marginTop: 10 }}>
                {/* Image  */}
                {/* If image is null do nothing else return image */}
                {!item.uri ? null :
                    <CustomImage uri={item.uri} style={styles.image} />}
            </View>
            <View style={{
                marginVertical: 15,
                paddingLeft: 15,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View>
                    <TouchableOpacity onPress={() => setLiked(!liked)}>
                        <Icon
                            style={{ marginRight: 7 }}
                            size={25}
                            name={liked ? 'heart' : 'heart-outlined'}
                            type={'entypo'}
                            color={liked ? 'red' : ''}
                        />
                    </TouchableOpacity>
                    {/* TODO: Introduce like animations
                https://dev.to/vcapretz/instagram-like-button-in-react-native-and-reanimated-v2-3h3k
                */}
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.likes.length}</Text>
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