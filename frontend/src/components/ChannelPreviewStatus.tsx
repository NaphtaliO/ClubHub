import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTheme} from 'stream-chat-expo';
import type {ChannelPreviewStatusProps} from 'stream-chat-expo';
import { IconProps, RootSvg, RootPath } from 'stream-chat-expo';

export const Right: React.FC<IconProps> = props => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M9.30567 18.6943C9.71388 19.1017 10.3757 19.1017 10.7839 18.6943L16.697 12.7931C16.9227 12.5678 17.0236 12.2653 16.9997 11.9708C17.0058 11.696 16.9039 11.4193 16.694 11.2096L10.7836 5.30568C10.3756 4.89811 9.71404 4.89811 9.30601 5.30568C8.89799 5.71326 8.89799 6.37408 9.30601 6.78166L14.5326 12.0025L9.30567 17.219C8.89746 17.6264 8.89746 18.2869 9.30567 18.6943Z"
      {...props}
    />
  </RootSvg>
);

const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    marginLeft: 2,
    marginRight: 5,
    textAlign: 'right',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  svg: {
    maxWidth: 16,
    maxHeight: 16,
  },
});

export const ChannelPreviewStatus = React.memo(
  ({
    formatLatestMessageDate,
    latestMessagePreview,
  }: ChannelPreviewStatusProps) => {
    const {
      theme: {
        channelPreview: {date},
        colors: {grey},
      },
    } = useTheme();

    const created_at = latestMessagePreview.messageObject?.created_at;
    const latestMessageDate = created_at ? new Date(created_at) : new Date();

    return (
      <View style={styles.flexRow}>
        <Text style={[styles.date, {color: grey}, date]}>
          {formatLatestMessageDate && latestMessageDate
            ? formatLatestMessageDate(latestMessageDate)
            : latestMessagePreview.created_at}
        </Text>
        <Right width={16} style={styles.svg} pathFill={grey} />
      </View>
    );
  },
);
