import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, IconProps, RootPath, RootSvg, useTheme } from 'stream-chat-expo';
import type { MessageResponse } from 'stream-chat';
import { formatLatestMessageDate } from '../Constants';

const width = Dimensions.get('window').width;
const vw = (number: number) => {
    return (number / 100) * width
}

const Right: React.FC<IconProps> = props => (
    <RootSvg {...props} viewBox="0 0 24 24">
        <RootPath
            d="M9.30567 18.6943C9.71388 19.1017 10.3757 19.1017 10.7839 18.6943L16.697 12.7931C16.9227 12.5678 17.0236 12.2653 16.9997 11.9708C17.0058 11.696 16.9039 11.4193 16.694 11.2096L10.7836 5.30568C10.3756 4.89811 9.71404 4.89811 9.30601 5.30568C8.89799 5.71326 8.89799 6.37408 9.30601 6.78166L14.5326 12.0025L9.30567 17.219C8.89746 17.6264 8.89746 18.2869 9.30567 18.6943Z"
            {...props}
        />
    </RootSvg>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    contentContainer: {
        height: 60,
        flex: 1,
        borderBottomWidth: 1,
    },
    avatarContainer: {
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: { fontSize: 14, fontWeight: '700', flex: 1, marginBottom: 3 },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 50,
        alignSelf: 'center',
        marginRight: 10,
    },
    circleFill: {
        backgroundColor: '#147EFB',
    },

    date: {
        fontSize: 12,
        marginLeft: 2,
        textAlign: 'right',
    },
    detailsText: { fontSize: 12 },
    flex: { flex: 1 },
    indicatorContainer: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    itemContainer: {
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    message: {
        flexShrink: 1,
        fontSize: 12,
    },
    titleContainer: {
        maxWidth: vw(80) - 16 - 40,
    },
    svg: {
        maxWidth: 16,
        maxHeight: 16,
    },
});

type MessageSearchListProps = {
    item: MessageResponse;
    setChannelWithId: (channelId: string, messageId?: string) => Promise<void>;
};

export const MessageSearchItem: React.FC<MessageSearchListProps> = ({
    item,
    setChannelWithId
}) => {
    const navigation = useNavigation();
    const {
        theme: {
            colors: { black, border, grey },
        },
    } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => {
                if (item.channel?.id) {
                    setChannelWithId(item.channel?.id, item.id);
                    navigation.navigate('StudentChannel');
                }
            }}
            style={[styles.container, { borderBottomColor: border }]}
            testID="channel-preview-button">
            <View style={[styles.avatarContainer]}>
                <Avatar
                    image={item.user?.image as string}
                    name={item.user?.name}
                    size={40}
                />
            </View>

            <View style={[styles.contentContainer, { borderColor: border }]}>
                <View style={[styles.row]}>
                    <Text
                        numberOfLines={1}
                        style={[styles.titleContainer, { color: black }]}>
                        <Text style={styles.title}>{`${item.user?.name} `}</Text>
                        {!!item.channel?.name && (
                            <Text style={styles.detailsText}>
                                in
                                <Text style={styles.title}>{` ${item.channel?.name}`}</Text>
                            </Text>
                        )}
                    </Text>
                    <View style={styles.row}>
                        <Text style={[styles.date, { color: grey }]}>
                            {formatLatestMessageDate(item.created_at)}
                        </Text>
                        <Right width={16} style={styles.svg} pathFill={grey} />
                    </View>
                </View>
                <View style={[styles.row]}>
                    <Text
                        numberOfLines={2}
                        style={[
                            styles.message,
                            {
                                color: grey,
                            },
                        ]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};