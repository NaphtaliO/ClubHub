import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { URL, VERSION } from '@env';
import { useInfiniteQuery } from '@tanstack/react-query';
import MasonryList from '@react-native-seoul/masonry-list';
import { useLogout } from '../../../hooks/useLogout';
import { useAppSelector } from '../../../hooks/hooks';
import { Image as ExpoImage } from 'expo-image';
import { Image, View, Card, Spacings, Constants, Colors, LoaderScreen } from 'react-native-ui-lib';
import { DiscoverScreenProps, PostProp } from '../../../types/types';
import ListEmpty from '../../../components/ListEmpty';

Spacings.loadSpacings({
    page: 10
});

// @ts-expect-error
const GUTTER_SIZE = Spacings.page;
// @ts-expect-error
const COLUMN_SIZE = (Constants.screenWidth - 2 * Spacings.page - GUTTER_SIZE) / 2;

const Discover = ({ navigation }: DiscoverScreenProps) => {
    const { logout } = useLogout();
    const user = useAppSelector((state) => state.user.value);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchRecommendations = async ({ pageParam }: { pageParam: number }) => {
        const res = await fetch(`${URL}/api/${VERSION}/post/recommendations?page=${pageParam}&limit=16`, {
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
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['recommendations'],
        queryFn: fetchRecommendations,
        gcTime: 86400000, // 24hrs in miliseconds
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
    })

    const onRefresh = () => {
        setRefreshing(true);
        refetch()
        setRefreshing(false);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {data && <MasonryList
                contentContainerStyle={styles.contentContainer}
                data={data?.pages?.flatMap(page => page)}
                // data={data?.pages?.map(page => page).flat()}
                
                onRefresh={onRefresh}
                renderItem={({ item }) => <ImageItem item={item} navigation={navigation} />}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={item => item?.uri}
                ListEmptyComponent={<ListEmpty title='Recommendations'
                    message='Recommended posts show up here ' />}/>}
            {isLoading && <LoaderScreen color={Colors.black} message="" overlay />}
        </View>
    )
}

export default Discover

const styles = StyleSheet.create({
    image: {
        width: COLUMN_SIZE,
        borderRadius: 10,
    },
    contentContainer: {
        marginLeft: 10
    }
});

const ImageItem = ({ item, navigation }: { item: PostProp } & DiscoverScreenProps) => {
    const [itemWidth, setItemWidth] = useState(COLUMN_SIZE)
    const [itemHeight, setItemHeight] = useState(COLUMN_SIZE)
    const [aspectRatio, setAspectRatio] = useState(1)

    useEffect(() => {
        Image.getSize(item.uri, (width: number, height: number) => {
            setItemWidth(width)
            setItemHeight(height)
            setAspectRatio(width / height)
        })
    }, [])

    return (
        <Card
            key={item?.uri}
            onPress={() => navigation.navigate('PostScreen', { post: item })}
            borderRadius={10}
            enableShadow
            paddingB-page
            useNative
            activeScale={0.98}
            activeOpacity={1}
        >
            <ExpoImage style={[styles.image, { aspectRatio: aspectRatio }]}
                source={item?.uri}
                transition={1000} />
        </Card>
    )
}