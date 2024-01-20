import { Alert, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import testIDs from '../testIDs';
import { agendaItems } from '../../mocks/agendaItems';

type ItemProp = {
    day?: string,
    height?: string,
    name?: string
}
const EventsScreen = () => {
    const [items, setItems] = useState<ItemProp>({})

    const loadItems = (day: DateData) => {

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }

            const newItems: AgendaSchedule = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems);
            console.log(Object.values(newItems)[0]);
            
        }, 1000);
        // setItems({ "2017-05-18": [{ "day": "2017-05-18", "height": 50, "name": "Item for 2017-05-18 #0" }], "2017-05-19": [{ "day": "2017-05-19", "height": 59, "name": "Item for 2017-05-19 #0" }, { "day": "2017-05-19", "height": 50, "name": "Item for 2017-05-19 #1" }], "2017-05-20": [{ "day": "2017-05-20", "height": 82, "name": "Item for 2017-05-20 #0" }, { "day": "2017-05-20", "height": 140, "name": "Item for 2017-05-20 #1" }], "2017-05-21": [{ "day": "2017-05-21", "height": 51, "name": "Item for 2017-05-21 #0" }, { "day": "2017-05-21", "height": 50, "name": "Item for 2017-05-21 #1" }, { "day": "2017-05-21", "height": 50, "name": "Item for 2017-05-21 #2" }], "2017-05-22": [{ "day": "2017-05-22", "height": 140, "name": "Item for 2017-05-22 #0" }, { "day": "2017-05-22", "height": 50, "name": "Item for 2017-05-22 #1" }, { "day": "2017-05-22", "height": 63, "name": "Item for 2017-05-22 #2" }] })
    };

    const renderDay = (day) => {
        if (day) {
            return <Text style={styles.customDay}>{day.getDay()}</Text>;
        }
        return <View style={styles.dayItem} />;
    };

    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? 'black' : '#43515c';

        return (
            <TouchableOpacity
                testID={testIDs.agenda.ITEM}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}
            >
                <Text style={{ fontSize, color }}>{reservation.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name;
    };

    const timeToString = (time: number) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    return (
        <Agenda
            testID={testIDs.agenda.CONTAINER}
            items={items}
            loadItemsForMonth={loadItems}
            selected={'2017-05-16'}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
            showClosingKnob={true}
        
            // staticHeader={true}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        // renderDay={this.renderDay}
        // hideExtraDays={false}
        // showOnlySelectedDayItems
        // reservationsKeyExtractor={this.reservationsKeyExtractor}
        />
    )
}

export default EventsScreen;

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green'
    },
    dayItem: {
        marginLeft: 34
    }
});