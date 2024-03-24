import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'
import { URL, VERSION } from '@env'
import { useLogout } from '../../../../hooks/useLogout'
import { logIn } from '../../../../redux/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NotificationSettingsScreenProp } from '../../../../types/types'

const NotificationSettings = ({ navigation }: NotificationSettingsScreenProp) => {
    const user = useAppSelector((state) => state.user.value);
    const [newEvents, setNewEvents] = useState(user?.settings?.notifications.newEvents);
    const [generalAnnouncements, setGeneralAnnouncements] = useState(user?.settings?.notifications.announcements);
    const [newPosts, setNewPosts] = useState(user?.settings?.notifications.newPosts);
    const [chatNotifications, setChatNotifications] = useState(user?.settings?.notifications.chat);
    const [liveStreamNotifications, setLiveStreamNotifications] = useState(user?.settings?.notifications.liveStream);
    const [loading, setLoading] = useState(false);
    const { logout } = useLogout();
    const dispatch = useAppDispatch();

    const updateNotificationSettings = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/${VERSION}/user/updateNotificationsSettings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    newEvents,
                    generalAnnouncements,
                    newPosts,
                    chatNotifications,
                    liveStreamNotifications
                })
            })

            const json = await response.json();
            const refreshedUser = { ...json, token: user?.token }

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));
                dispatch(logIn(refreshedUser));
                navigation.goBack();
            }
        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={updateNotificationSettings}>
                    <Text style={{ fontSize: 18 }}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, updateNotificationSettings]);

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subscribe To</Text>
                <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                        <Feather
                            color="#fff"
                            name="calendar"
                            size={20} />
                    </View>

                    <Text style={styles.rowLabel}>New Events</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                        onValueChange={() => setNewEvents(previousState => !previousState)}
                        value={newEvents} />
                </View>

                <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                        <Feather
                            color="#fff"
                            name="alert-circle"
                            size={20} />
                    </View>

                    <Text style={styles.rowLabel}>General Announcements</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                        onValueChange={() => setGeneralAnnouncements(previousState => !previousState)}
                        value={generalAnnouncements} />
                </View>

                <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                        <Feather
                            color="#fff"
                            name="list"
                            size={20} />
                    </View>

                    <Text style={styles.rowLabel}>New Posts</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                        onValueChange={() => setNewPosts(previousState => !previousState)}
                        value={newPosts} />
                </View>

                <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                        <Feather
                            color="#fff"
                            name="message-circle"
                            size={20} />
                    </View>

                    <Text style={styles.rowLabel}>Chat Messaging</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                        onValueChange={() => setChatNotifications(previousState => !previousState)}
                        value={chatNotifications} />
                </View>

                <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: 'red' }]}>
                        <Feather
                            color="#fff"
                            name="video"
                            size={20} />
                    </View>

                    <Text style={styles.rowLabel}>Live Stream</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                        onValueChange={() => setLiveStreamNotifications(previousState => !previousState)}
                        value={liveStreamNotifications} />
                </View>
            </View>
        </View>
    )
}

export default NotificationSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    section: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        paddingVertical: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#9e9e9e',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
    },
    /** Row */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
    },
    rowIcon: {
        width: 32,
        height: 32,
        borderRadius: 9999,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '400',
        color: '#0c0c0c',
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
})