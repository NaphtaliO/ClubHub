import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {isOwnUser} from 'stream-chat';
import {
  ChannelAvatar,
  IconProps,
  RootPath,
  RootSvg,
  useChannelPreviewDisplayName,
  useTheme,
} from 'stream-chat-expo';
import type {Channel as ChannelType} from 'stream-chat';

export const BackButton: React.FC<IconProps> = props => (
  <RootSvg {...props} viewBox="0 0 50 50">
    <RootPath
      d="M 34.960938 2.9804688 A 2.0002 2.0002 0 0 0 33.585938 3.5859375 L 13.585938 23.585938 A 2.0002 2.0002 0 0 0 13.585938 26.414062 L 33.585938 46.414062 A 2.0002 2.0002 0 1 0 36.414062 43.585938 L 17.828125 25 L 36.414062 6.4140625 A 2.0002 2.0002 0 0 0 34.960938 2.9804688 z"
      {...props}
    />
  </RootSvg>
);

import { chatClient } from '../types/types';

export const CHANNEL_SCREEN_HEADER_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 8,
    flex: 1,
  },
  leftContainer: {
    flex: 1,
  },
  backButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  counterBadge: {
    borderRadius: 20,
    paddingHorizontal: 5,
  },
  rightContainer: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});


export const ChannelHeader = ({
  channel,
  navigation,
}) => {
  const displayName = useChannelPreviewDisplayName(channel);
  // const {chatClient} = useContext(AppContext);
  const [count, setCount] = useState<number>();
  const {
    theme: {
      colors: {accent_blue, white},
    },
  } = useTheme();

  useEffect(() => {
    const user = chatClient?.user;
    const unreadCount = isOwnUser(user) ? user.total_unread_count : undefined;
    setCount(unreadCount);
    const listener = chatClient?.on(e => {
      if (e.total_unread_count) {
        setCount(e.total_unread_count);
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [chatClient]);

  return (
    <>
      <View style={[styles.container]}>
        <View style={[styles.middleContainer]}>
          <View style={styles.leftContainer}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <View style={styles.backButtonContainer}>
                <BackButton pathFill={accent_blue} width={22} />
                {count ? (
                  <View
                    style={[
                      styles.counterBadge,
                      {backgroundColor: accent_blue},
                    ]}>
                    <Text style={{color: white}}>{count}</Text>
                  </View>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          </View>
          {channel && <ChannelAvatar channel={channel} />}
          <View style={styles.rightContainer} />
        </View>
        <Text style={[styles.text]}>{displayName}</Text>
      </View>
    </>
  );
};
