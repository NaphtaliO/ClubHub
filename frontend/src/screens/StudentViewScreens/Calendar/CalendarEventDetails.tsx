import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CalendarEventDetailsProps } from '../../../types/types';
import { URL, VERSION } from '@env';
import { useAppSelector } from '../../../hooks/hooks';
import { useLogout } from '../../../hooks/useLogout';
import { Colors, LoaderScreen, Button as UIButton } from 'react-native-ui-lib';

type Prop = {
    setEvents: () => void
}

const CalendarEventDetails = ({ route, navigation }: CalendarEventDetailsProps) => {
    const [event, setEvent] = useState(route.params.event);
    const user = useAppSelector((state) => state.user.value);
    const { logout } = useLogout();
    const [loading, setLoading] = useState<boolean>(false);
    const [streaming, setStreaming] = useState(false);

    // Convert string dates to Date objects
    const startDate = new Date(`${event.start}`);
    const endDate = new Date(`${event.end}`);

    // Format date strings
    const formattedStartDate = startDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Format time strings
    const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // console.log(formattedStartDate);
    // console.log(formattedStartTime);
    // console.log(formattedEndTime);

    const hasNotResponded = !event?.rsvp?.accepted.includes(`${user?._id}`) && !event?.rsvp?.declined.includes(`${user?._id}`);
    const isDeclined = event?.rsvp?.declined.includes(`${user?._id}`);
    const isAccepted = event?.rsvp?.accepted.includes(`${user?._id}`);

    const rsvp = async (response: "accept" | "decline") => {
        try {
            const res = await fetch(`${URL}/api/${VERSION}/event/rsvp/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ response })
            })
            const json = await res.json()
            if (!res.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (res.ok) {
                setEvent(json);
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.location}>{event?.location}</Text>
            <Text style={styles.date}>{formattedStartDate}</Text>
            <Text style={styles.date}>from {formattedStartTime} to {formattedEndTime}</Text>
            <Text style={[styles.date, { paddingTop: 10 }]}>{event.summary}</Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 30
            }}>
                {hasNotResponded ? (
                    <>
                        <UIButton
                            backgroundColor="#439F4F"
                            label="Accept"
                            size={UIButton.sizes.medium}
                            borderRadius={5}
                            onPress={() => rsvp("accept")}
                            labelStyle={{ fontWeight: '500', letterSpacing: -0.5 }}
                            style={{ marginBottom: 30 }}
                        />
                        <UIButton
                            backgroundColor={Colors.$backgroundDangerHeavy}
                            label="Decline"
                            size={UIButton.sizes.medium}
                            borderRadius={5}
                            onPress={() => rsvp("decline")}
                            labelStyle={{ fontWeight: '500', letterSpacing: -0.5 }}
                            style={{ marginBottom: 30 }}
                        />
                    </>
                ) : isAccepted ? (
                    <>
                        <UIButton
                            backgroundColor="#439F4F"
                            label="Accepted"
                            onPress={() => rsvp("accept")}
                            size={UIButton.sizes.medium}
                            borderRadius={5}
                            disabled={true}

                            labelStyle={{ fontWeight: '500', letterSpacing: -0.5 }}
                            style={{ marginBottom: 30 }}
                        />
                        <UIButton
                            backgroundColor={Colors.$backgroundDangerHeavy}
                            label="Decline"
                            size={UIButton.sizes.medium}
                            borderRadius={5}
                            onPress={() => rsvp("decline")}
                            labelStyle={{ fontWeight: '500', letterSpacing: -0.5 }}
                            style={{ marginBottom: 30 }}
                        />
                    </>
                ) : isDeclined ? (
                    <>
                        <UIButton
                            backgroundColor="#439F4F"
                            label="Accept"
                            onPress={() => rsvp("accept")}
                            size={UIButton.sizes.medium}
                            borderRadius={5}

                            labelStyle={{ fontWeight: '500', letterSpacing: -0.5 }}
                            style={{ marginBottom: 30 }}
                        />
                        <UIButton
                            backgroundColor={Colors.$backgroundDangerHeavy}
                            label="Declined"
                            size={UIButton.sizes.medium}
                            borderRadius={5}
                            disabled={true}
                            onPress={() => rsvp("decline")}
                            labelStyle={{ fontWeight: '500', letterSpacing: -0.5 }}
                            style={{ marginBottom: 30 }}
                        />
                    </>
                ) : null}

            </View>
            <View style={styles.buttonContainer}>
                <Button title='Watch Live' color={''}
                    onPress={() => navigation.navigate('WatchLiveStream', { event: event })}
                /> 

            </View>
            {loading && <LoaderScreen color={Colors.blue30} message="" overlay />}
        </View>
    )
}

export default CalendarEventDetails

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