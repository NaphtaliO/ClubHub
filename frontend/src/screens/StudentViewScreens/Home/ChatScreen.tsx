import { StyleSheet } from 'react-native'
import React from 'react'
import { useAppContext } from '../../../context/AppContext';
import { Channel, MessageInput, MessageList } from 'stream-chat-expo';
import { ChatScreenProp } from '../../../types/types';

const ChatScreen = ({navigation}: ChatScreenProp) => {
    const { channel } = useAppContext();

    return (
        <Channel channel={channel}>
            <MessageList
                onThreadSelect={(message) => {
                    if (channel?.id) {
                        setThread(message);
                        navigation.navigate('ThreadScreen');
                    }
                }} />
            <MessageInput />
        </Channel>
    );
}

export default ChatScreen

const styles = StyleSheet.create({})