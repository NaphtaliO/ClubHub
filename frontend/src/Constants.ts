import { DefaultTheme } from 'react-native-paper';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { DeepPartial, Theme } from 'stream-chat-expo';
dayjs.extend(calendar);

const IOS_GREEN = '#53d769';

export const THEME_COLOUR: string = '#3AB0FF';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: '#000000',
        primary: '#560CCE',
        secondary: '#414757',
        error: '#f13a59',
    },
}

export function formatLatestMessageDate(date?: Date | string) {
    return dayjs(date).calendar(undefined, {
        lastDay: '[Yesterday]', // The day before ( Yesterday )
        sameDay: 'HH:mm', // The same day ( 17:30 )
        lastWeek: 'dddd', // Last week ( Monday)
        sameElse: 'DD/MM/YYYY', // Everything else ( 17/10/2011 )
    });
}

export const myMessageTheme: DeepPartial<Theme> = {
    messageSimple: {
        content: {
            containerInner: {
                backgroundColor: IOS_GREEN,
                borderColor: IOS_GREEN,
            },
            markdown: {
                text: {
                    color: '#FCFCFC',
                },
            },
        },
    },
};
