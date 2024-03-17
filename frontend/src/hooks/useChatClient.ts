// useChatClient.js

import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAppSelector } from './hooks';
import { LIVESTREAMAPIKEY } from '@env';
import { DefaultStreamChatGenerics } from 'stream-chat-expo';

export const useChatClient = () => {
    const user = useAppSelector((state) => state.user.value);
    const [clientIsReady, setClientIsReady] = useState(false);

    const chatUser = {
        id: `${user?._id}`,
        name: `${user?.name}`,
        image: `${user?.avatar}`
    };

    const token = `${user?.token}`;
    const chatClient = StreamChat.getInstance<DefaultStreamChatGenerics>(LIVESTREAMAPIKEY);

    useEffect(() => {
        if (!user) return;
        const setupClient = async () => {
            try {
                await chatClient.connectUser(chatUser, token);
                setClientIsReady(true);
                

                // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
                // But in case you need the chat to load from offline storage first then you should render chat components
                // immediately after calling `connectUser()`.
                // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`An error occurred while connecting the user: ${error.message}`);
                }
            }
        };

        // If the chat client has a value in the field `userID`, a user is already connected
        // and we can skip trying to connect the user again.
        if (!chatClient.userID) {
            setupClient();
        }
        // return () => {
        //     if (chatClient) {
        //         chatClient.disconnectUser();
        //     }
        // }
    }, [user]);

    return {
        clientIsReady,
    };
};
