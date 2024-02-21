import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    ExpandableCalendar,
    TimelineEventProps,
    TimelineList,
    CalendarProvider,
    TimelineProps,
    CalendarUtils
} from 'react-native-calendars';

import { timelineEvents, getDate } from '../../../mocks/timelineEvents';
import { URL, VERSION } from '@env';
import { useAppSelector } from '../../../hooks/hooks';
import { useLogout } from '../../../hooks/useLogout';
import { CalendarScreenProps } from '../../../types/types';

const INITIAL_TIME = { hour: 9, minutes: 0 };
const EVENTS: TimelineEventProps[] = timelineEvents;

const Calendar = ({ navigation }: CalendarScreenProps) => {
    const user = useAppSelector((state) => state.user.value);
    const { logout } = useLogout();
    const [currentDate, setCurrentDate] = useState(getDate());
    const [events, setEvents] = useState<TimelineEventProps[]>([]);
    const [eventsByDate, setEventsByDate] = useState(
        groupBy(events, e => CalendarUtils.getCalendarDateString(e.start)) as {
            [key: string]: TimelineEventProps[];
        }
    );

    useEffect(() => {
        // Group the events by date and update 'eventsByDate'
        setEventsByDate(groupBy(events, e => CalendarUtils.getCalendarDateString(e.start)));
    }, [events]);

    const marked = {
        // [`${getDate(-1)}`]: { marked: true },
        // [`${getDate()}`]: { marked: true },
        // [`${getDate(1)}`]: { marked: true },
        // [`${getDate(2)}`]: { marked: true },
        // [`${getDate(4)}`]: { marked: true }
        // TODO: Fix marked dates both in student and clubs
    };

    const onDateChanged = (date: string, source: string) => {
        console.log('TimelineCalendarScreen onDateChanged: ', date, source);
        setCurrentDate(date);
    };

    const onMonthChange = (month: any, updateSource: any) => {
        console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
    };

    const createNewEvent: TimelineProps['onBackgroundLongPress'] = (timeString, timeObject) => {
        const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
        const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

        const newEvent = {
            id: 'draft',
            start: `${timeString}`,
            end: `${timeObject.date} ${hourString}:${minutesString}:00`,
            title: 'New Event',
            color: 'white'
        };

        if (timeObject.date) {
            if (eventsByDate[timeObject.date]) {
                eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date], newEvent];
                setEventsByDate(eventsByDate)
            } else {
                eventsByDate[timeObject.date] = [newEvent];
                setEventsByDate({ ...eventsByDate })
            }
        }
    };

    const approveNewEvent: TimelineProps['onBackgroundLongPressOut'] = (_timeString, timeObject) => {
        Alert.prompt('New Event', 'Enter event title', [
            {
                text: 'Cancel',
                onPress: () => {
                    if (timeObject.date) {
                        eventsByDate[timeObject.date] = filter(eventsByDate[timeObject.date], e => e.id !== 'draft');
                        setEventsByDate(eventsByDate)
                            
                    }
                }
            },
            {
                text: 'Create',
                onPress: eventTitle => {
                    if (timeObject.date) {
                        const draftEvent = find(eventsByDate[timeObject.date], { id: 'draft' });
                        if (draftEvent) {
                            draftEvent.id = undefined;
                            draftEvent.title = eventTitle ?? 'New Event';
                            draftEvent.color = 'lightgreen';
                            eventsByDate[timeObject.date] = [...eventsByDate[timeObject.date]];
                            setEventsByDate(eventsByDate)
                        }
                    }
                }
            }
        ]);
    };

    const timelineProps: Partial<TimelineProps> = {
        format24h: true,
        onBackgroundLongPress: createNewEvent,
        onBackgroundLongPressOut: approveNewEvent,
        // scrollToFirst: true,
        // start: 0,
        // end: 24,
        unavailableHours: [{ start: 0, end: 6 }, { start: 22, end: 24 }],
        overlapEventsSpacing: 8,
        rightEdgeSpacing: 24,
    };

    const getAllEvents = async () => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/event/getAllStudentsEvents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                }
            })
            const json = await response.json()
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setEvents(json)
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // refresh data here
            getAllEvents()
        });
        return () => unsubscribe();
    }, [navigation])

    return (
        <CalendarProvider
            date={currentDate}
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChange}
            showTodayButton
            disabledOpacity={0.6}
        // numberOfDays={3}
        >
            <ExpandableCalendar
                firstDay={1}
                leftArrowImageSource={require('../../../assets/previous.png')}
                rightArrowImageSource={require('../../../assets/next.png')}
                markedDates={marked}
            />
            <TimelineList
                events={eventsByDate}
                timelineProps={timelineProps}
                showNowIndicator
                // scrollToNow
                scrollToFirst
                initialTime={INITIAL_TIME}
            />
        </CalendarProvider>
    )
}

export default Calendar;