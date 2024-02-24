import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClubViewPost from '../../../components/ClubViewPost'
import { useAppSelector } from '../../../hooks/hooks'
import { URL, VERSION } from '@env'
import { PostProp } from '../../../types/types'
import { useLogout } from '../../../hooks/useLogout'
import { useInfiniteQuery } from '@tanstack/react-query'

const Feed = () => {
  const [posts, setPosts] = useState<PostProp[]>([]);
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { logout } = useLogout();

  // const getPosts = async () => {
  //   try {
  //     const response = await fetch(`${URL}/api/${VERSION}/post/getPostsByClub`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${user?.token}`
  //       },
  //     })

  //     const json = await response.json()

  //     if (!response.ok) {
  //       if (json.error === "Request is not authorized") {
  //         logout()
  //       }
  //     }
  //     if (response.ok) {
  //       setPosts(json)
  //     }
  //   } catch (error) {
  //     console.log((error as Error).message);
  //   }
  // }

  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(`${URL}/api/${VERSION}/post/getPostsByClub?page=${pageParam}&limit=5`, {
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
    refetch
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
  })

  useEffect(() => {
    // getPosts()
  }, [])

  if (error) {
    console.log(error);
    
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

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
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
        data={data?.pages.flatMap(page => page)}
        renderItem={({ item }) => <ClubViewPost item={item} setPosts={setPosts} posts={posts} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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