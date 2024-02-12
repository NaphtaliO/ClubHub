import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DateTimePicker, TextField, View, Text, Colors, Stepper } from 'react-native-ui-lib'
import { CreateEventScreenProps } from '../../../types/types';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import { useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
// import EventMapLocation from '../../components/EventMapLocation';

const dropDownIcon = <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
const stepperProps = {
    minValue: 1,
    maxValue: 10,
    value: 1
}

const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();
    // Pad month and day with leading zeros if necessary
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
}

const formatTime = (dateString: Date) => {
    const date = new Date(dateString);

    // Get hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert hours to 12-hour format
    let formattedHours = hours % 12;
    formattedHours = formattedHours === 0 ? 12 : formattedHours;

    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Determine AM or PM
    const amOrPm = hours < 12 ? 'am' : 'pm';

    // Return formatted time string
    return `${formattedHours}:${formattedMinutes}${amOrPm}`;
}

const CreateEvent = ({ navigation }: CreateEventScreenProps) => {
    const user = useSelector((state) => state.user.value);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState<number>(1);
    const { logout } = useLogout();

    const handleCreate = async () => {
        if (loading) return;
        if (!title || !location) alert("Fields can't be empty");
        setLoading(true)
        try {
            const event = {
                duration: `${duration}h`,
                hour: formatTime(time),
                title: title,
                location,
                date: formatDate(date),
            }
            console.log(event);

            const response = await fetch(`${URL}/api/${VERSION}/event/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(event)
            })

            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            }
            // navigation.navigate('Home');
        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false)
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button mode="contained"
                    onPress={handleCreate}
                    loading={loading}
                >
                    Post
                </Button>
            ),
        });
    }, [navigation, loading, handleCreate]);

    return (
        <View style={styles.container} padding-20 flex>
            <Text style={{ fontSize: 22, fontWeight: '500', paddingBottom: 15 }}>Event Info</Text>
            <TextField
                placeholder={'Event Name'}
                floatingPlaceholder
                floatingPlaceholderStyle={styles.inputs}
                onChangeText={setTitle}
                value={title}
                // enableErrors
                showCharCounter
                maxLength={60}
                style={styles.inputs}
                fieldStyle={styles.withUnderline}
            />
            {/* TODO: Add field for description */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <DateTimePicker placeholder={'Event Day'} mode={'date'}
                    floatingPlaceholder
                    floatingPlaceholderStyle={styles.inputs}
                    style={[styles.inputs, { width: 150 }]}
                    trailingAccessory={dropDownIcon}
                    value={date}
                    onChange={(t) => setDate(t)}
                    fieldStyle={styles.withUnderline}
                />
                <DateTimePicker placeholder={'Event Time'} mode={'time'}
                    floatingPlaceholder
                    floatingPlaceholderStyle={styles.inputs}
                    style={[styles.inputs, { width: 150 }]}
                    trailingAccessory={dropDownIcon}
                    value={time}
                    onChange={(t) => setTime(t)}
                    fieldStyle={styles.withUnderline}

                />
            </View>
            <View row spread centerV style={{ marginTop: 20, marginBottom: 10 }}>
                <Text text70 $textDefault>
                    Duration
                </Text>
                <Stepper
                    onValueChange={setDuration}
                    maxValue={stepperProps.maxValue}
                    minValue={stepperProps.minValue}
                    value={duration}
                    testID={'durationStepper'}
                />
            </View>
            <TextField
                placeholder={'Location'}
                floatingPlaceholder
                floatingPlaceholderStyle={styles.inputs}
                value={location}
                onChangeText={setLocation}
                style={styles.inputs}
                fieldStyle={styles.withUnderline}
                validate={'required'}
                validationMessage={'Cant be empty'}

            />
            {/* <EventMapLocation location={location} /> */}
        </View>
    )
}

export default CreateEvent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 20
    },
    inputs: {
        fontSize: 17,
        paddingTop: 4,
        paddingBottom: 4,
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.$outlineDisabledHeavy,
        paddingBottom: 4
    },
})