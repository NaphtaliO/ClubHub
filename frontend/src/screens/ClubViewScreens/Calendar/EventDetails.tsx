import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { EventDetailsProps } from '../../../types/types';
import { URL, VERSION } from '@env';
import { useAppSelector } from '../../../hooks/hooks';
import { useLogout } from '../../../hooks/useLogout';
import { Colors, LoaderScreen } from 'react-native-ui-lib';

type Prop = {
    setEvents: () => void
}

const EventDetails = ({ route, navigation }: EventDetailsProps) => {
    const { event } = route.params;
    const user = useAppSelector((state) => state.user.value);
    const { logout } = useLogout();
    const [loading, setLoading] = useState<boolean>(false);

    // Convert string dates to Date objects
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    // Format date strings
    const formattedStartDate = startDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Format time strings
    const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // console.log(formattedStartDate);
    // console.log(formattedStartTime);
    // console.log(formattedEndTime);

    const shouldDelete = () => {
        Alert.alert('Delete this event?', '', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            { text: 'Delete', style: 'default', onPress: () => deleteEvent() }
        ])
    }

    const deleteEvent = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/${VERSION}/event/delete/${event._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            })
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                // setEvents(json)
                navigation.goBack()
            }
        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.location}>{event?.location}</Text>
            <Text style={styles.date}>{formattedStartDate}</Text>
            <Text style={styles.date}>from {formattedStartTime} to {formattedEndTime}</Text>
            <Text style={[styles.date, { paddingTop: 10 }]}>{event.summary}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Go Live' color={''}
                    onPress={() => navigation.navigate('LiveStream', { event: event })}
                />
                <Button title='Delete Event' color={'red'} onPress={shouldDelete}/>
            </View>
            {loading && <LoaderScreen color={Colors.blue30} message="" overlay />}
        </View>
    )
}

export default EventDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15
    },
    title: {
        fontSize: 27,
        fontWeight: '700',
        letterSpacing: 1
    },
    location: {
        paddingTop: 3,
        fontSize: 17,
        letterSpacing: 1,
        paddingBottom: 25
    },
    date: {
        fontSize: 17,
        color: '#808080'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 15
    }
})