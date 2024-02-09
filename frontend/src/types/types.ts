import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef } from "react";
import { ViewStyle, TextStyle, View } from 'react-native';

export type RootStackParamList = {
  TabNav: NavigatorScreenParams<RootTabParamList>,
  CreatePost: undefined,
  CreateEvent: undefined,
  LogIn: undefined,
  CreateAccount: undefined,
  StartScreen: undefined
};

export type RootTabParamList = {
  Home: undefined,
  Create: undefined,
  Calendar: undefined,
  Profile: undefined
};

// export type CreateScreenProps = CompositeScreenProps<
//   BottomTabScreenProps<RootTabParamList, 'Create'>,
//   NativeStackScreenProps<RootStackParamList>
// >;

export type CreatePostScreenProps = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;
export type CreateEventScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;
export type LogInScreenProps = NativeStackScreenProps<RootStackParamList, 'LogIn'>;
export type CreateAccountScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;
export type StartScreenProps = NativeStackScreenProps<RootStackParamList, 'StartScreen'>

interface Club {
  name: string,
  email: string,
  password: string,
  bio: string,
  avatar: string,
  type: string,
  website: string,
  pushToken: object,
  acceptedTerms: boolean
}

export type MarkedDates = {
  [key: string]: MarkingProps;
};

export type MarkingTypes = 'dot' | 'multi-dot' | 'period' | 'multi-period' | 'custom';

export interface MarkingProps extends DotProps {
  type?: MarkingTypes;
  theme?: Theme;
  selected?: boolean;
  marked?: boolean;
  today?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
  textColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  customTextStyle?: StyleProp<TextStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  dotColor?: string;
  //multi-dot
  dots?: DOT[];
  //multi-period
  periods?: PERIOD[];
  startingDay?: boolean;
  endingDay?: boolean;
  accessibilityLabel?: string;
  customStyles?: CustomStyle;
}

// const Dot = ({ theme, marked, disabled, inactive, color, today, selected }: DotProps) => {
//   const style = useRef(styleConstructor(theme));
//   const dotStyle = [style.current.dot] as object[];

//   if (marked) {
//     dotStyle.push(style.current.visibleDot);

//     if (today) {
//       dotStyle.push(style.current.todayDot);
//     }

//     if (disabled) {
//       dotStyle.push(style.current.disabledDot);
//     }

//     if (inactive) {
//       dotStyle.push(style.current.inactiveDot);
//     }

//     if (selected) {
//       dotStyle.push(style.current.selectedDot);
//     }

//     if (color) {
//       dotStyle.push({ backgroundColor: color });
//     }
//   }

//   return <View style={ dotStyle } />;
// };

export interface DotProps {
  theme?: Theme;
  color?: string;
  marked?: boolean;
  selected?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  today?: boolean;
}

interface Student {
  name: string,
  email: string,
  password: string,
  mobile: string,
  bio: string,
  avatar: string,
  type: string,
  website: string,
  pushToken: object,
  acceptedTerms: boolean
}

export interface User extends Club, Student {}

export interface Theme {
  timelineContainer?: object;
  contentStyle?: ViewStyle;
  event?: object;
  eventTitle?: object;
  eventSummary?: object;
  eventTimes?: object;
  line?: object;
  verticalLine?: object;
  nowIndicatorLine?: object;
  nowIndicatorKnob?: object;
  timeLabel?: object;
  todayTextColor?: string;
  calendarBackground?: string;
  indicatorColor?: string;
  textSectionTitleColor?: string;
  textSectionTitleDisabledColor?: string;
  dayTextColor?: string;
  selectedDayTextColor?: string;
  monthTextColor?: string;
  selectedDayBackgroundColor?: string;
  arrowColor?: string;
  textDisabledColor?: string;
  textInactiveColor?: string;
  backgroundColor?: string; //TODO: remove in V2
  dotColor?: string;
  selectedDotColor?: string;
  disabledArrowColor?: string;
  textDayFontFamily?: TextStyle['fontFamily'];
  textMonthFontFamily?: TextStyle['fontFamily'];
  textDayHeaderFontFamily?: TextStyle['fontFamily'];
  textDayFontWeight?: TextStyle['fontWeight'];
  textMonthFontWeight?: TextStyle['fontWeight'];
  textDayHeaderFontWeight?: TextStyle['fontWeight'];
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  agendaDayTextColor?: string;
  agendaDayNumColor?: string;
  agendaTodayColor?: string;
  agendaKnobColor?: string;
  todayButtonFontFamily?: TextStyle['fontFamily'];
  todayButtonFontWeight?: TextStyle['fontWeight'];
  todayButtonFontSize?: number;
  textDayStyle?: TextStyle;
  dotStyle?: object;
  arrowStyle?: ViewStyle;
  todayBackgroundColor?: string;
  disabledDotColor?: string;
  inactiveDotColor?: string;
  todayDotColor?: string;
  todayButtonTextColor?: string;
  todayButtonPosition?: string;
  arrowHeight?: number;
  arrowWidth?: number;
  weekVerticalMargin?: number;
  stylesheet?: {
    calendar?: {
      main?: object; 
      header?: object;
    };
    day?: {
      basic?: object; 
      period?: object;
    };
    dot?: object;
    marking?: object;
    'calendar-list'?: {
      main?: object;
    };
    agenda?: {
      main?: object; 
      list?: object;
    };
    expandable?: {
      main?: object;
    };
  };
}