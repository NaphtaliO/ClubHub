import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  SafeAreaView,
} from 'react-native';
import {
  Channel,
  IconProps,
  MessageInput,
  MessageList,
  RootPath,
  RootSvg,
  useChatContext,
  useMessageContext,
  useTheme,
  // vw,
} from 'stream-chat-expo';
import type {
  Channel as StreamChatChannel,
  Message as StreamMessage,
  SendMessageAPIResponse,
} from 'stream-chat';

import { SelectedUserTag } from '../../../components/SelectedUserTag';
import { UserSearchResults } from '../../../components/UserSearchResults';
import { InlineDateSeparator } from '../../../components/InlineDateSeparator';
// import { Channel } from '../../../components/Channel';

import { useNewMessageContext } from '../../../context/NewMessageContext';
import { myMessageTheme } from '../../../Constants';
import { useAppContext } from '../../../context/AppContext';
import { NewMessageScreenProp, chatClient } from '../../../types/types';
import { Image } from 'expo-image';

export const CirclePlus: React.FC<IconProps> = props => (
  <RootSvg {...props}>
    <RootPath
      d="M11 8a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V8z"
      {...props}
    />
    <RootPath
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4 12a8 8 0 1116 0 8 8 0 01-16 0z"
      {...props}
    />
  </RootSvg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    paddingHorizontal: 10,
  },
  headerLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerLeft: {
    width: 24,
  },
  emptyMessageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  inputBox: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingRight: 16,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: 'center', // for android vertical text centering
  },
  inputBoxContainer: {
    flexDirection: 'row',
    marginHorizontal: 3,
  },
  noChats: { fontSize: 12 },
  searchContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainerLeft: {
    fontSize: 12,
    paddingLeft: 16,
    paddingVertical: 20,
    textAlignVertical: 'center',
  },
  searchContainerMiddle: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchContainerRight: {
    justifyContent: 'flex-end',
    paddingRight: 16,
    paddingVertical: 10,
  },
  selectedUsersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  selectedUserTagContainer: {
    marginHorizontal: 3,
  },
});

const EmptyMessagesIndicator = () => {
  const {
    theme: {
      colors: { grey },
    },
  } = useTheme();
  return (
    <View style={styles.emptyMessageContainer}>
      <Text
        style={[
          styles.noChats,
          {
            color: grey,
          },
        ]}>
        No chats here yet...
      </Text>
    </View>
  );
};

export const NewMessageScreen = ({ navigation }: NewMessageScreenProp) => {
  const {
    theme: {
      colors: { black, border, grey, white, accent_blue, grey_whisper },
    },
  } = useTheme();
  const { setChannel } = useAppContext();

  const {
    onChangeSearchText,
    onFocusInput,
    results,
    searchText,
    selectedUserIds,
    selectedUsers,
    toggleUser,
    removeUser,
    reset,
  } = useNewMessageContext();

  const messageInputRef = useRef<TextInput | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const currentChannel = useRef<StreamChatChannel>();
  const isDraft = useRef(true);

  const [focusOnMessageInput, setFocusOnMessageInput] = useState(false);
  const [focusOnSearchInput, setFocusOnSearchInput] = useState(true);
  const [, setMessageInputText] = useState('');

  // const {client: chatClient} = useChatContext();


  // When selectedUsers are changed, initiate a channel with those users as members,
  // and set it as a channel on current screen.
  const selectedUsersLength = selectedUsers.length;
  useEffect(() => {
    const initChannel = async () => {
      if (!chatClient?.user?.id) {
        return;
      }

      // If there are no selected users, then set dummy channel.
      if (selectedUsers.length === 0) {
        setFocusOnMessageInput(false);
        return;
      }

      const members = [chatClient.user.id, ...selectedUserIds];
      // Check if the channel already exists.
      const channels = await chatClient.queryChannels({
        distinct: true,
        members,
      });

      if (channels.length === 1) {
        // Channel already exist
        currentChannel.current = channels[0];
        isDraft.current = false;
      } else {
        // Channel doesn't exist.
        isDraft.current = true;
        const channel = chatClient.channel('messaging', {
          members,
        });

        // Hack to trick channel component into accepting channel without watching it.
        channel.initialized = true;
        currentChannel.current = channel;
      }

      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      setFocusOnMessageInput(true);
    };

    initChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUsersLength]);

  /**
   * 1. If the current channel is draft, then we create the channel and then send message
   * Otherwise we simply send the message.
   *
   * 2. And then navigate to ChannelScreen
   */
  const customSendMessage = useCallback(
    async (
      _: string,
      message: StreamMessage,
    ): Promise<SendMessageAPIResponse> => {
      try {
        if (!selectedUsers || !currentChannel.current) {
          throw new Error('Missing selected users or current channel');
        }

        if (isDraft.current) {
          currentChannel.current.initialized = false;
          await currentChannel.current.create();
        }

        const response = await currentChannel.current.sendMessage(message);

        if (currentChannel.current.id) {
          await setChannel(currentChannel.current);
          // navigation.replace('Main', { screen: 'Channel' });
          navigation.replace('StudentChannel')
        }

        return response;
      } catch (e) {
        Alert.alert('Error sending a message');
        throw e;
      }
    },
    [navigation, selectedUsers, setChannel, currentChannel],
  );

  const onSearchPress = useCallback(() => {
    setFocusOnMessageInput(false);
    setFocusOnSearchInput(true);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const additionalTextInputProps = useMemo(
    () => ({
      onFocus: () => {
        setFocusOnMessageInput(true);
        setFocusOnSearchInput(false);
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      },
    }),
    [],
  );

  const renderUserSearch = () => (
    <View
      style={[
        { backgroundColor: white },
        focusOnSearchInput ? styles.container : undefined,
      ]}>
      {/* <View style={[styles.headerContainer, { backgroundColor: grey_whisper }]}>
        <View style={styles.headerLeftContainer} />
        <Text style={styles.headerTitle}>New message</Text>
        <View style={styles.headerRightContainer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />
        </View>
      </View> */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onSearchPress}
        style={[
          styles.searchContainer,
          {
            backgroundColor: white,
            borderBottomColor: border,
          },
        ]}>
        <Text
          style={[
            styles.searchContainerLeft,
            {
              color: grey,
            },
          ]}>
          To:
        </Text>
        <View style={styles.searchContainerMiddle}>
          {selectedUsers.length > 0 && (
            <View style={styles.selectedUsersContainer}>
              {selectedUsers.map((tag, index) => {
                const tagProps = {
                  disabled: !focusOnSearchInput,
                  index,
                  onPress: () => {
                    removeUser(index);
                  },
                  tag,
                };

                return (
                  <View key={index} style={styles.selectedUserTagContainer}>
                    <SelectedUserTag {...tagProps} />
                  </View>
                );
              })}
            </View>
          )}
          {focusOnSearchInput && (
            <View style={styles.inputBoxContainer}>
              <TextInput
                onChangeText={onChangeSearchText}
                onFocus={onFocusInput}
                placeholder="Type a name"
                placeholderTextColor={grey}
                ref={searchInputRef}
                style={[
                  styles.inputBox,
                  {
                    color: black,
                    paddingBottom: selectedUsers.length ? 16 : 0,
                  },
                ]}
                value={searchText}
              />
            </View>
          )}
        </View>
        <View style={styles.searchContainerRight}>
          <CirclePlus pathFill={accent_blue} />
        </View>
      </TouchableOpacity>
      {results && focusOnSearchInput && (
        <UserSearchResults
          toggleSelectedUser={user => {
            setFocusOnSearchInput(false);
            toggleUser(user);
          }}
        />
      )}
    </View>
  );

  if (!chatClient) return null;

  if (!currentChannel.current) {
    return renderUserSearch();
  }


  const CustomAvatar = () => {
    const { message } = useMessageContext();

    return <Image source={{ uri: message.user?.image }} />;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: white,
        },
      ]}>
      <Channel
        MessageAvatar={CustomAvatar}
        additionalTextInputProps={additionalTextInputProps}
        channel={currentChannel.current}
        EmptyStateIndicator={EmptyMessagesIndicator}
        enforceUniqueReaction
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : -300}
        // myMessageTheme={myMessageTheme}
        onChangeText={setMessageInputText}
        overrideOwnCapabilities={{ sendMessage: true }}
        doSendMessageRequest={customSendMessage}
        setInputRef={ref => (messageInputRef.current = ref)}
      >
        {renderUserSearch()}
        {results && results.length >= 0 && !focusOnSearchInput && (
          <MessageList
            StickyHeader={() => null}
            InlineDateSeparator={InlineDateSeparator}
          />
        )}
        {selectedUsers.length > 0 && !focusOnSearchInput && <MessageInput />}
      </Channel>
    </SafeAreaView>
  );
};
