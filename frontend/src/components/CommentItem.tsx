import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAppSelector } from '../hooks/hooks'
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import { CommentProp } from '../types/types';
import CustomImage from './CustomImage';
import { formatDistanceToNowStrict } from 'date-fns';

type CommentItemProp = {
    item: CommentProp,
    deleteComment: (id: string) => void
}

const CommentItem = ({ item, deleteComment }: CommentItemProp) => {
    const authUser = useAppSelector((state) => state.user.value);
    const user = item.student ? item.student : item.club;
    const { showActionSheetWithOptions } = useActionSheet();

    const actionSheet = (id: string, user_id: string) => {
        Haptics.selectionAsync();
        showActionSheetWithOptions({
            options: user_id === authUser?._id || authUser?.type === 'club' ? ["Cancel", "Delete"] : ["Cancel", "Report"],
            cancelButtonIndex: 0,
            destructiveButtonIndex: 1
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case 0:
                    // Cancel
                    break;
                case 1:
                    if (user_id === authUser?._id || authUser?.type === 'club') {
                        Alert.alert('Delete Comment?', '', [
                            {
                                text: 'Cancel',
                                onPress: () => { },
                                style: 'cancel',
                            },
                            { text: 'Delete', onPress: () => deleteComment(id), style: 'destructive' },
                        ]);
                    } else {
                        // reportComment(id);
                        Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success
                        )
                        alert("Comment reported");
                    }
                    break;
            }
        });
    }

    return (
        <TouchableOpacity onLongPress={() => actionSheet(item._id, `${user?._id}`)}>
            <View style={styles.commentContainer}>
                {/* <TouchableWithoutFeedback onPress={() => {
                    user._id === item.user_id ? navigation.push('ProfileStack') :
                        navigation.push('UserProfileScreen', { username: item.username, id: item.user_id })
                }}> */}
                <View style={styles.imageContainer}>
                    {!user?.avatar ?
                        <Image
                            style={styles.image}
                            source={require('../assets/default_avatar.png')}
                        /> :
                        <CustomImage
                            style={styles.image}
                            uri={user.avatar}
                        />}
                </View>
                {/* </TouchableWithoutFeedback> */}

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ color: "#606470", fontSize: 13 }}>{user?.name}</Text>
                    <Text style={styles.text}>{item.comment}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: "#606470", fontSize: 13 }}>{formatDistanceToNowStrict(new Date(item.createdAt)) + " ago"}</Text>
                        {/* <TouchableOpacity><Text style={styles.replyButton}>reply</Text></TouchableOpacity> */}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default CommentItem

const styles = StyleSheet.create({
    image: {
        borderRadius: 50,
        width: 50,
        height: 50,
    },
    imageContainer: {
        paddingRight: 10,
        alignSelf: 'center'
    },
    text: {
        fontSize: 17,
        letterSpacing: 1,
    },
    commentContainer: {
        margin: 15,
        flexDirection: 'row'
    }
})