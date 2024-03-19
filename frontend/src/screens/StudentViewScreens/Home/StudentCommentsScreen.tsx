import { FlatList, KeyboardAvoidingView, LogBox, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import { CommentProp, StudentCommentsScreenProps } from '../../../types/types';
import CommentItem from '../../../components/CommentItem';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const StudentCommentsScreen = ({ navigation, route }: StudentCommentsScreenProps) => {
    const { post_id, refetch } = route.params;
    const user = useAppSelector((state) => state.user.value);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<CommentProp[]>([]);
    const { logout } = useLogout();

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            refetch();
            navigation.dispatch(e.data.action);
        })
    }, [navigation, refetch])

    const getComments = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`${URL}/api/${VERSION}/comment/getComments/${post_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            })
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setComments(json);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
        setRefreshing(false);
    }

    const createComment = async () => {
        if (loading || !comment) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/${VERSION}/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ comment, post_id, student: user?._id })
            })
            const json = await response.json();
            let res = {
                ...json, student: {
                    _id: user?._id,
                    name: user?.name,
                    avatar: user?.avatar,
                }
            }
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setComment("");
                setComments([res, ...comments]);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false);
    }

    const deleteComment = async (id: string) => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/comment/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            })
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setComments(comments.filter(comment => comment._id !== json._id))
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getComments();
        setRefreshing(false);
    }

    useEffect(() => {
        getComments();
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={comments}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => <CommentItem item={item} deleteComment={deleteComment} />}
                keyExtractor={item => item._id}
            //   ListEmptyComponent={<ListEmpty title={"No Comments yet"} message={`Comments on this post will appear here`} />}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={84}>
                <View style={{ marginTop: 'auto', marginHorizontal: 20 }}
                // onLayout={event => {
                //   let { height } = event.nativeEvent.layout;
                //   console.log(height);
                // }}
                // Get height of the view for keyboard avoiding view vertical offset
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setComment(text)}
                            value={comment}
                            placeholder={'Add comment...'}
                            autoCorrect={false}
                            multiline={true}
                        />
                        <TouchableOpacity onPress={createComment} style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default StudentCommentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginRight: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
    }
})