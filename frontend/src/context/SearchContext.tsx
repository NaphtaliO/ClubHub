import React, { ReactNode, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { usePaginatedSearchedMessages } from '../hooks/usePaginatedSearchedMessages';

type SearchContextType = {
    searchInputRef: React.MutableRefObject<TextInput | null>;
    searchInputText: string;
    setSearchInputText: (text: string) => void;
    setSearchQuery: (text: string) => void;
    searchQuery: string;
} & ReturnType<typeof usePaginatedSearchedMessages>;

export const SearchContext = React.createContext({} as SearchContextType);

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const searchInputRef = useRef<TextInput | null>(null);
    const [searchInputText, setSearchInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const searchProps = usePaginatedSearchedMessages(searchQuery);

    return (
        <SearchContext.Provider
            value={{
                searchInputRef,
                searchInputText,
                setSearchInputText,
                searchQuery,
                setSearchQuery,
                ...searchProps,
            }}>
            {children}
        </SearchContext.Provider>
    );
};