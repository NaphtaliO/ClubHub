import React, { ReactNode, createContext, useContext, useState } from 'react';

export const AppContext = createContext(
    {
        channel: null,
        setChannel: (channel) => { },
        thread: null,
        setThread: (thread) => { }
    }
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();

    return (
        <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);