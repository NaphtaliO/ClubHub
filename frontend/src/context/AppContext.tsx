import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Channel as ChannelType, StreamChat } from 'stream-chat';
import { StreamChatGenerics } from '../types/types';

type AppContextType = {
    // chatClient: StreamChat<StreamChatGenerics>;
    channel: ChannelType<StreamChatGenerics> | undefined;
    setChannel: (channel: ChannelType<StreamChatGenerics>) => void;
    thread: any;
    // setChannelWithId: (channelId: string, messageId?: string) => Promise<void>;
    // messageId?: string;
};

export const AppContext = createContext(
    {
        channel: null,
        setChannel: (channel) => { },
        thread: null,
        setThread: (thread) => { },
        messageId: '',
        setMessageId: (messageId) => { }
    }
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();
    const [messageId, setMessageId] = useState('');

    return (
        <AppContext.Provider value={{ channel, setChannel, thread, setThread, messageId, setMessageId }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);