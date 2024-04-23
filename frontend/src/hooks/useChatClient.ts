import { useEffect, useRef, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAppSelector } from './hooks';
import { LIVESTREAMAPIKEY } from '@env';
import { DefaultStreamChatGenerics } from 'stream-chat-expo';
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatClient } from '../types/types';

// Request Push Notification permission from device.
const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //     console.log('Authorization status:', authStatus);
    // }
};

export const useChatClient = () => {
    const user = useAppSelector((state) => state.user.value);
    const [clientIsReady, setClientIsReady] = useState(false);
    const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

    const chatUser = {
        id: `${user?._id}`,
        name: `${user?.name}`,
        image: `${user?.avatar}`
    };

    const token = `${user?.token}`;

    useEffect(() => {
        if (!user) return;
        const registerPushToken = async () => {
            // unsubscribe any previous listener
            unsubscribeTokenRefreshListenerRef.current?.();
            const token = await messaging().getToken();
            const push_provider = 'firebase';
            const push_provider_name = 'firebaseservicekey'; // name an alias for your push provider (optional)
            chatClient.setLocalDevice({
                id: token,
                push_provider,
                // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
                push_provider_name,
            });
            await AsyncStorage.setItem('@current_push_token', token);

            const removeOldToken = async () => {
                const oldToken = await AsyncStorage.getItem('@current_push_token');
                if (oldToken !== null) {
                    await chatClient.removeDevice(oldToken);
                }
            };

            unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(async newToken => {
                await Promise.all([
                    removeOldToken(),
                    chatClient.addDevice(newToken, push_provider, user?._id, push_provider_name),
                    AsyncStorage.setItem('@current_push_token', newToken),
                ]);
            });
        };

        const init = async () => {
            try {
                // Chat notification will only work if the student has it turned on
                if (user.type === "student" && user.settings?.notifications.chat) {
                    await requestPermission();
                    await registerPushToken();
                } else if (user.type === "club") {
                    await requestPermission();
                    await registerPushToken();
                }
            } catch (error) {
                console.log((error as Error).message);
            } finally {
                // If the chat client has a value in the field `userID`, a user is already connected
                // and we can skip trying to connect the user again.
                if (!chatClient.userID) {
                    await chatClient.connectUser(chatUser, token);
                    setClientIsReady(true);
                }
            }
        };

        init();

        return () => {
            chatClient?.disconnectUser();
            unsubscribeTokenRefreshListenerRef.current?.();
        };
    }, [user]);

    return {
        clientIsReady,
        chatClient
    };
};
