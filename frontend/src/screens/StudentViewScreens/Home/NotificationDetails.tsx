import { ScrollView, StyleSheet, Text } from 'react-native';
import React from 'react';
import { NotificationDetailsProp } from '../../../types/types';

const NotificationDetails = ({ route }: NotificationDetailsProp) => {
    const { notification } = route.params;

    return (
        <ScrollView style={styles.container}
            contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text style={styles.title}>General Notification</Text>
            <Text style={styles.body}>Title: {notification.body}</Text>
            <Text style={styles.message}>Message: {notification.data.message}</Text>
        </ScrollView>
    )
}

export default NotificationDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 20
    },
    body: {
        fontSize: 20,
        letterSpacing: 1,
        marginBottom: 15
    },
    message: {
        fontSize: 20,
        letterSpacing: 1,
    }
})