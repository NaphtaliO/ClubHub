import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  ClubViewTabNav: NavigatorScreenParams<ClubViewTabParamList>,
  StudentViewTabNav: NavigatorScreenParams<StudentViewTabParamList>,
  CreatePost: undefined,
  CreateEvent: undefined,
  LogIn: undefined,
  CreateAccount: undefined,
  StartScreen: undefined
};

export type StudentViewTabParamList = {
  Home: undefined,
  Search: undefined,
  Calendar: undefined,
  Profile: undefined
};

export type ClubViewTabParamList = {
  Home: undefined,
  Create: undefined,
  Calendar: undefined,
  Profile: undefined
};


export type LogInScreenProps = NativeStackScreenProps<RootStackParamList, 'LogIn'>;
export type CreateAccountScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;
export type StartScreenProps = NativeStackScreenProps<RootStackParamList, 'StartScreen'>

// ClubViewScreens
export type CreatePostScreenProps = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;
export type CreateEventScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;
export type EventsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ClubViewTabParamList, 'Calendar'>,
  NativeStackScreenProps<RootStackParamList>
  >;

// StudentView Screens
export type SearchScreenProps = CompositeScreenProps<
  BottomTabScreenProps<StudentViewTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface UserValue {
  _id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  type: string;
  website: string;
  pushToken: object;
  acceptedTerms: boolean;
  token: string;
}

interface Club {
  value: UserValue | null;
}

interface Student {
  value: UserValue | null;
}

export type PostProp = {
  _id: string,
  uri: string,
  caption: string,
  type: 'image' | 'video',
  likes: string[]
  club: {
    _id: string,
    name: string,
    avatar: "string"
  },
  comments: string[],
  createdAt: string,
  updatedAt: string
}

export interface User extends Club, Student { }