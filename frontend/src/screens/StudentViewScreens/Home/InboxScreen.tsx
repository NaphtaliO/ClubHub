import { StyleSheet } from 'react-native';
import React from 'react';
import { useAppSelector } from '../../../hooks/hooks';
import { ChannelList } from 'stream-chat-expo';
import { useAppContext } from '../../../context/AppContext';
import { InboxScreenProp } from '../../../types/types';

const InboxScreen = ({ navigation }: InboxScreenProp) => {
    const user = useAppSelector((state) => state.user.value);
    const { setChannel } = useAppContext();

    const filters = {
        members: {
            '$in': [`${user?._id}`]
        },
    };

    const sort = {
        last_message_at: -1,
    };

    return (
        <ChannelList
            // filters={filters}
            // sort={sort}
            onSelect={(channel) => {
                setChannel(channel);
                navigation.navigate('ChatScreen');
            }}
        />
    )
}

export default InboxScreen

const styles = StyleSheet.create({})