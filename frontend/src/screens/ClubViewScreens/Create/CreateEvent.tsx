import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextField, View, Text, Colors } from 'react-native-ui-lib'
import { CreateEventScreenProps } from '../../../types/types';
import { Button } from 'react-native-paper';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '../../../hooks/hooks';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { color } from '@rneui/base';
// import EventMapLocation from '../../../components/EventMapLocation';

function getRandomColor() {
    const colors: string[] = ['#e6add8', 'pink', 'lightblue', 'orange']
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const CreateEvent = ({ navigation }: CreateEventScreenProps) => {
    const user = useAppSelector((state) => state.user.value);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date(new Date().getTime() + (1 * 60 * 60 * 1000)));
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState('');
    const { logout } = useLogout();

    const formatDate = (dateString: Date) => {
        let originalDate = new Date(dateString);

        // Format the date to the desired format
        let formattedDate = originalDate.getFullYear() + '-' +
            ('0' + (originalDate.getMonth() + 1)).slice(-2) + '-' +
            ('0' + originalDate.getDate()).slice(-2) + ' ' +
            ('0' + originalDate.getHours()).slice(-2) + ':' +
            ('0' + originalDate.getMinutes()).slice(-2) + ':' +
            ('0' + originalDate.getSeconds()).slice(-2);

        return formattedDate
    }

    const handleCreate = async () => {
        if (loading) return;
        if (!title || !location || !summary) {
            alert("Fields can't be empty");
            return;
        }
        setLoading(true)
        try {
            const event = {
                title,
                start: formatDate(start),
                end: formatDate(end),
                summary,
                location,
                color: getRandomColor()
            }

            const response = await fetch(`${URL}/api/${VERSION}/event/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
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
                navigation.navigate('ClubViewTabNav', { screen: 'Calendar' });
            }
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
    }, [navigation, handleCreate, loading]);

    return (
        <View style={styles.container} padding-20 flex>
            <Text style={{ fontSize: 22, fontWeight: '500', paddingBottom: 15 }}>Event Info</Text>
            <TextField
                placeholder={'Event Title'}
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
            <View row spread centerV style={{ marginTop: 20, marginBottom: 10 }}>
                <Text text70 $textDefault>
                    Start Time
                </Text>
                <RNDateTimePicker
                    style={{ marginLeft: 'auto' }}
                    mode='datetime'
                    onChange={(e: DateTimePickerEvent, date?: Date) => setStart(date)}
                    value={start}
                />
            </View>
            <View row spread centerV style={{ marginTop: 20, }}>
                <Text text70 $textDefault>
                    End Time
                </Text>
                <RNDateTimePicker
                    style={{ marginLeft: 'auto' }}
                    mode='datetime'
                    onChange={(e: DateTimePickerEvent, date?: Date) => setEnd(date)}
                    value={end}
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
            <TextField
                placeholder={'Event Summary'}
                floatingPlaceholder
                floatingPlaceholderStyle={styles.inputs}
                onChangeText={setSummary}
                value={summary}
                // enableErrors
                showCharCounter
                maxLength={200}
                multiline
                style={styles.inputs}
                fieldStyle={styles.withUnderline}
            />
            {/* <EventMapLocation location={location} /> */}
        </View>
    )
}

export default CreateEvent;

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