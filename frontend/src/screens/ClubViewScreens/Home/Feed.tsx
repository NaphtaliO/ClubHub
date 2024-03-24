import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import React, { useRef, useState } from 'react';
import ClubViewPost from '../../../components/ClubViewPost';
import { useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import { ClubHomeScreenProps, PostProp } from '../../../types/types';
import { useInfiniteQuery } from '@tanstack/react-query';

const { height, width } = Dimensions.get('window');

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const Feed = ({ navigation }: ClubHomeScreenProps) => {
  const [posts, setPosts] = useState<PostProp[]>([]);
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const cellRefs = useRef<any>({});

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
  });

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

  const _onViewableItemsChanged = (props: any) => {
    const changed = props.changed;
    changed.forEach((item: any) => {
      const cell = cellRefs.current[item.item._id];
      if (cell) {
        if (item.isViewable) {
          // console.log(item.index);
          cell.current?.playAsync()
          // console.log("play");
        } else if (!item.isViewable) {
          cell.current?.pauseAsync();
          // console.log("pause");
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        data={data?.pages.flatMap(page => page)}
        renderItem={({ item, index }) => (
          <ClubViewPost onVideoRef={(videoRef) => {
            cellRefs.current[item._id] = videoRef.current;
            // console.log(videoRef);
          }} item={item} refetch={refetch} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onViewableItemsChanged={_onViewableItemsChanged}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        getItemLayout={(_data, index) => ({
          length: cellHeight,
          offset: cellHeight * index,
          index,
        })}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
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