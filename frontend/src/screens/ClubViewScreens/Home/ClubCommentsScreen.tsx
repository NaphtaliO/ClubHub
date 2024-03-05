import { FlatList, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import { ClubCommentsScreenProps } from '../../../types/types';

const ClubCommentsScreen = ({ navigation, route }: ClubCommentsScreenProps) => {
    const { post_id } = route.params;
    const user = useAppSelector((state) => state.user.value);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState([]);
    const { logout } = useLogout();

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
                body: JSON.stringify({ comment, post_id })
            })
            const json = await response.json();

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setComment("");
                console.log(json);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false);
    }

  return (
      <View style={styles.container}>
          <FlatList
              refreshControl={<RefreshControl refreshing={refreshing} />}
              data={comments}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => <Text>f</Text>
                //   <Comment item={item} navigation={navigation} actionSheet={actionSheet} />
              }
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

export default ClubCommentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        //padding: 8,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginRight: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
    }
})