import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useContext } from 'react';
import { useAppSelector } from '../../../hooks/hooks';
import { ChannelAvatar, ChannelList, Search, useTheme } from 'stream-chat-expo';
import { useAppContext } from '../../../context/AppContext';
import { ClubChannelListScreenProp, chatClient } from '../../../types/types';
import { ChannelSort } from 'stream-chat';
import { SearchContext } from '../../../context/SearchContext';
import { MessageSearchList } from '../../../components/MessageSearchList';
import { ChannelPreviewMessenger } from '../../../components/ChannelPreviewMessenger';
import { Image } from 'expo-image';

const ClubChannelList = ({ navigation }: ClubChannelListScreenProp) => {
    const user = useAppSelector((state) => state.user.value);
    const { channel, setChannel, setMessageId } = useAppContext();

    const {
        theme: {
            colors: { grey, grey_gainsboro },
        },
    } = useTheme();

    const { searchQuery, loading, loadMore, messages, refreshing, refreshList } =
        useContext(SearchContext);

    const filters = {
        members: {
            '$in': [`${user?._id}`]
        },
        type: 'messaging'
    };

    const sort: ChannelSort = {
        last_message_at: -1,
    };

    const options = {
        presence: true,
        state: true,
        watch: true,
    };

    const additionalFlatListProps = {
        keyboardDismissMode: 'on-drag' as const,
        getItemLayout: (_: any, index: number) => ({
            index,
            length: 65,
            offset: 65 * index,
        }),
    };


    const EmptySearchIndicator = () => (
        <View style={styles.emptyIndicatorContainer}>
            <Search height={112} pathFill={grey_gainsboro} width={112} />
            <Text style={[styles.emptyIndicatorText, { color: grey }]}>
                {`No results for "${searchQuery}"`}
            </Text>
        </View>
    );

    const setChannelWithId = useCallback(
        async (channelId: string, innerMessageId?: string) => {
            const newChannel = chatClient?.channel('messaging', channelId);

            if (!newChannel?.initialized) {
                await newChannel?.watch();
            }
            // console.log(channel, innerMessageId, 'nebebeh');
            setChannel(newChannel);
            setMessageId(innerMessageId);
            // setState({ channel: newChannel, messageId: innerMessageId });
        },
        [],
    );

    return (
        // <ChannelList
        //     // filters={filters}
        //     // sort={sort}
        //     onSelect={(channel) => {
        //         setChannel(channel);
        //         navigation.navigate('StudentChannel');
        //     }}
        // />
        <View style={StyleSheet.absoluteFill}>
            {(!!searchQuery || (messages && messages.length > 0)) && (
                <MessageSearchList
                    EmptySearchIndicator={EmptySearchIndicator}
                    loading={loading}
                    loadMore={loadMore}
                    messages={messages}
                    refreshing={refreshing}
                    refreshList={refreshList}
                    setChannelWithId={setChannelWithId}
                />
            )}
            <View style={{ flex: searchQuery ? 0 : 1 }}>
                <View
                    style={[styles.channelListContainer, { opacity: searchQuery ? 0 : 1 }]}>
                    <ChannelList
                        additionalFlatListProps={additionalFlatListProps}
                        filters={filters}
                        HeaderNetworkDownIndicator={() => null}
                        maxUnreadCount={99}
                        onSelect={(channel) => {
                            setChannel(channel);
                            navigation.navigate('ClubChannel');
                        }}
                        options={options}
                        Preview={ChannelPreviewMessenger}
                        sort={sort}
                        // PreviewAvatar={({ channel }) => (
                        //     <TouchableOpacity
                        //         disallowInterruption={true}
                        //         onPress={() => {
                        //             /** Handler for press action */
                        //         }}
                        //     >
                        //         <ChannelAvatar channel={channel} ImageComponent={<Image/>} />
                        //     </TouchableOpacity>
                        // )}
                    />
                </View>
            </View>
        </View>
    )
}

export default ClubChannelList;

const styles = StyleSheet.create({
    channelListContainer: {
        height: '100%',
        position: 'absolute',
        width: '100%',
    },
    emptyIndicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    emptyIndicatorText: { paddingTop: 28 },
    flex: {
        flex: 1,
    },
    searchContainer: {
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: 'row',
        margin: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        includeFontPadding: false, // for android vertical text centering
        padding: 0, // removal of default text input padding on android
        paddingHorizontal: 10,
        paddingTop: 0, // removal of iOS top padding for weird centering
        textAlignVertical: 'center', // for android vertical text centering
    },
})