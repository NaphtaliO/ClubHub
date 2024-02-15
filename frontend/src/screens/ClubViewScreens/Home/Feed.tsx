import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClubViewPost from '../../../components/ClubViewPost'
import { useAppSelector } from '../../../hooks/hooks'
import { URL, VERSION } from '@env'
import { PostProp } from '../../../types/types'
import { useLogout } from '../../../hooks/useLogout'

const Feed = () => {
  const [posts, setPosts] = useState<PostProp[]>([]);
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { logout } = useLogout();

  const getPosts = async () => {
    try {
      const response = await fetch(`${URL}/api/${VERSION}/post/getPostsByClub`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
      })

      const json = await response.json()

      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        setPosts(json)
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true);
    getPosts();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        data={posts}
        renderItem={({ item }) => <ClubViewPost item={item} setPosts={setPosts} posts={posts} />}
        keyExtractor={item => item._id}
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