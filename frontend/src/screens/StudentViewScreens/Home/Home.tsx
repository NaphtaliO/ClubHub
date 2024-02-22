import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { PostProp } from '../../../types/types';
import { useAppSelector } from '../../../hooks/hooks';
import StudentViewPost from '../../../components/StudentViewPost';
import { URL, VERSION } from '@env';
import { useInfiniteQuery } from '@tanstack/react-query';

const Home = () => {
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(`${URL}/api/${VERSION}/post/getStudentsFeed?page=${pageParam}&limit=10`, {
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

  const onRefresh = async () => {
    setRefreshing(true);
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

  // const scrollToTop = () => {
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  //   }
  // };

  return (
    <View style={styles.container}>
      <FlatList
        // ref={flatListRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        data={data?.pages.flatMap(page => page)}
        renderItem={({ item }) => <StudentViewPost item={item} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})