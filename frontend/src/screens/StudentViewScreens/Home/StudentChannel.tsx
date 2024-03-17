import { StyleSheet } from 'react-native'
import React from 'react'
import { useAppContext } from '../../../context/AppContext';
import { Channel, MessageInput, MessageList, useMessageContext, useTheme } from 'stream-chat-expo';
import { StudentChannelProp } from '../../../types/types';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InlineDateSeparator } from '../../../components/InlineDateSeparator';
import { useHeaderHeight } from '@react-navigation/elements';
import { myMessageTheme } from '../../../Constants';


const CustomAvatar = () => {
    const { message } = useMessageContext();

    return <Image source={{ uri: message.user?.image }} />;
};

const StudentChannel = ({ navigation }: StudentChannelProp) => {
    const { channel, messageId } = useAppContext();
    const headerHeight = useHeaderHeight();
    const {
        theme: {
            colors: { grey },
            messageInput: { attachButtonContainer },
        },
    } = useTheme();

    return (
        // <SafeAreaView>
        <Channel
            channel={channel}
            messageId={messageId}
            MessageAvatar={CustomAvatar}
            // myMessageTheme={myMessageTheme}
            // keyboardVerticalOffset={headerHeight}
        >
            <MessageList
                StickyHeader={() => null}
                InlineDateSeparator={InlineDateSeparator}
                onThreadSelect={(message) => {
                    if (channel?.id) {
                        setThread(message);
                        navigation.navigate('ThreadScreen');
                    }
                }} />
            <MessageInput />
        </Channel>
        // </SafeAreaView >
    );
}

export default StudentChannel;

const styles = StyleSheet.create({})