import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { theme } from '../../../Constants';
import { useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import * as Haptics from 'expo-haptics';
import { useLogout } from '../../../hooks/useLogout';
import { SendNotificationScreenProps } from '../../../types/types';
import { ToastContext } from '../../../components/CustomToast';

const SendNotification = ({ navigation }: SendNotificationScreenProps) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useAppSelector((state) => state.user.value);
    const { logout } = useLogout();
    const displayToast = useContext(ToastContext);

    const handleCreate = async () => {
        if (loading) return;
        if (!title || !message) {
            alert("Fields can't be empty");
            return;
        }
        setLoading(true)
        try {
            const notification = {
                body: title,
                data: {
                    type: 'notification',
                    message: message
                }
            }
            
            const response = await fetch(`${URL}/api/${VERSION}/notification/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(notification)
            })

            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                displayToast?.displayToast(`${json.message}`, "success")
                navigation.navigate('ClubViewTabNav', { screen: 'Home' });
            }
        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false)
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleCreate}>
                    <Text>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, handleCreate, loading]);

    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 20, marginVertical: 25 }}>
                <TextInput
                    style={[styles.textInput, { marginTop: 15 }]}
                    label="Title"
                    value={title}
                    onChangeText={text => setTitle(text)}
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    maxLength={30}
                    mode="outlined"
                />
                <TextInput
                    style={[styles.textInput, styles.message]}
                    // label="Message"
                    placeholder='Message'
                    value={message}
                    onChangeText={text => setMessage(text)}
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    multiline={true}
                />
            </View>
        </View>
    )
}

export default SendNotification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    textInput: {
        backgroundColor: theme.colors.surface,
        marginBottom: 40
    },
    message: {
        height: 250
    }
})