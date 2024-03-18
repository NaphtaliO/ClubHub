import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useAppContext } from '../../../context/AppContext';
import { Channel, ChannelAvatar, MessageInput, MessageList, useMessageContext, useTheme } from 'stream-chat-expo';
import { ClubChannelProp } from '../../../types/types';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { InlineDateSeparator } from '../../../components/InlineDateSeparator';
import { useHeaderHeight } from '@react-navigation/elements';
import { myMessageTheme } from '../../../Constants';


const CustomAvatar = () => {
    const { channel } = useAppContext();
    const { message } = useMessageContext();
    if (!message?.user?.image) {
        return <ChannelAvatar channel={channel} />
    }

    return <Image source={message?.user?.image} style={styles.image} />;
};

const ClubChannel = ({ navigation }: ClubChannelProp) => {
    const { channel, messageId } = useAppContext();
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const {
        theme: {
            colors: { grey },
            messageInput: { attachButtonContainer },
        },
    } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: insets.bottom }}>
            <Channel
                channel={channel}
                messageId={messageId}
                // MessageAvatar={CustomAvatar}
                // myMessageTheme={myMessageTheme}
                keyboardVerticalOffset={headerHeight}
            >
                <MessageList
                    StickyHeader={() => null}
                    InlineDateSeparator={InlineDateSeparator}
                // onThreadSelect={(message) => {
                //     if (channel?.id) {
                //         setThread(message);
                //         navigation.navigate('ThreadScreen');
                //     }
                // }}
                />
                <MessageInput />
            </Channel>
        </View>
    );
}

export default ClubChannel;

const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginRight: 5
    }
})