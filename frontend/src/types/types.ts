import { LIVESTREAMAPIKEY } from "@env";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StreamChat } from "stream-chat";

export type RootStackParamList = {
  ClubViewTabNav: NavigatorScreenParams<ClubViewTabParamList>,
  StudentViewTabNav: NavigatorScreenParams<StudentViewTabParamList>,
  ClubProfile: { id: string, name: string },
  EditClubProfile: undefined,
  EditStudentProfile: undefined,
  CreatePost: undefined,
  CreateEvent: undefined,
  LogIn: undefined,
  CreateAccount: undefined,
  StartScreen: undefined,
  LiveStream: { event: Event },
  WatchLiveStream: { event?: Event },
  EventDetails: { event: Event },
  CalendarEventDetails: { event: Event },
  TermsAndConditions: undefined,
  ClubCommentsScreen: { post_id: string, refetch: () => void },
  StudentCommentsScreen: { post_id: string, refetch: () => void },
  NotificationScreen: undefined,
  SendNotification: undefined,
  NotificationDetails: { notification: Notification },
  StudentChannelList: undefined,
  StudentChannel: undefined,
  ThreadScreen: undefined,
  NewMessageScreen: undefined,
  ClubChannelList: undefined,
  ClubChannel: undefined,
  ClubNewMessageScreen: undefined,
  StudentSettings: undefined,
  DeleteAccount: undefined,
  NotificationSettings: undefined,
};

export interface Event {
  _id?: string,
  location?: string,
  title?: string,
  start?: string,
  end?: string,
  summary?: string,
  club?: object,
  rsvp?: { accepted: string[], declined: string[] },
  createdAt?: string,
  updatedAt?: string,
}

export interface Notification {
  _id: string,
  title: string,
  body: string,
  data: {
    type: 'notification' | 'newEvent',
    message?: string,
    event?: Event
  },
  club: {
    _id: string,
    name: string,
    avatar: string
  },
  student: string,
  createdAt: string,
  updatedAt: string
}

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
export type SendNotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'SendNotification'>;
export type ClubCommentsScreenProps = NativeStackScreenProps<RootStackParamList, 'ClubCommentsScreen'>;
export type LiveStreamProps = NativeStackScreenProps<RootStackParamList, 'LiveStream'>;
export type EventDetailsProps = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;
export type CalendarEventDetailsProps = NativeStackScreenProps<RootStackParamList, 'CalendarEventDetails'>;
export type ClubHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ClubViewTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type EventsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ClubViewTabParamList, 'Calendar'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ClubProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ClubViewTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

// StudentView Screens
export type WatchLiveStreamProps = NativeStackScreenProps<RootStackParamList, 'WatchLiveStream'>;
export type StudentHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<StudentViewTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type SearchScreenProps = CompositeScreenProps<
  BottomTabScreenProps<StudentViewTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type CalendarScreenProps = CompositeScreenProps<
  BottomTabScreenProps<StudentViewTabParamList, 'Calendar'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type StudentProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<StudentViewTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type StudentCommentsScreenProps = NativeStackScreenProps<RootStackParamList, 'StudentCommentsScreen'>;
export type ClubProfileScreen = NativeStackScreenProps<RootStackParamList, 'ClubProfile'>;
export type NotificationScreenProp = NativeStackScreenProps<RootStackParamList, 'NotificationScreen'>;
export type NotificationDetailsProp = NativeStackScreenProps<RootStackParamList, 'NotificationDetails'>;
export type StudentChannelListScreenProp = NativeStackScreenProps<RootStackParamList, 'StudentChannelList'>;
export type StudentChannelProp = NativeStackScreenProps<RootStackParamList, 'StudentChannel'>;
export type ThreadScreenProp = NativeStackScreenProps<RootStackParamList, 'ThreadScreen'>;
export type NewMessageScreenProp = NativeStackScreenProps<RootStackParamList, 'NewMessageScreen'>;
export type ClubChannelListScreenProp = NativeStackScreenProps<RootStackParamList, 'ClubChannelList'>;
export type ClubChannelProp = NativeStackScreenProps<RootStackParamList, 'ClubChannel'>;
// export type ThreadScreenProp = NativeStackScreenProps<RootStackParamList, 'ThreadScreen'>;
export type ClubNewMessageScreenProp = NativeStackScreenProps<RootStackParamList, 'ClubNewMessageScreen'>;
export type EditStudentProfileProp = NativeStackScreenProps<RootStackParamList, 'EditStudentProfile'>;
export type StudentSettingsScreenProp = NativeStackScreenProps<RootStackParamList, 'StudentSettings'>;
export type DeleteAccountScreenProp = NativeStackScreenProps<RootStackParamList, 'DeleteAccount'>;
export type NotificationSettingsScreenProp = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;



export interface Club {
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
  location: string;
  members: string[]
}

export interface Student {
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
  members: string[];
  blockedUsers: string[];
  settings?: {
    notifications: {
      newEvents: boolean,
      announcements: boolean,
      newPosts: boolean,
      chat: boolean,
      liveStream: boolean,
    }
  }
}

export interface State {
  value: {
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
    location?: string;
    members?: string[];
    memberships?: string[];
    blockedUsers?: string[];
    settings?: {
      notifications: {
        newEvents: boolean,
        announcements: boolean,
        newPosts: boolean,
        chat: boolean,
        liveStream: boolean,
      }
    }
  } | null
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

export type CommentProp = {
  _id: string,
  comment: string,
  post: string,
  student?: {
    _id: string,
    avatar: string,
    name: string
  },
  club?: {
    _id: string,
    avatar: string,
    name: string
  },
  createdAt: string,
  updatedAt: string
}

type LocalAttachmentType = Record<string, unknown>;
type LocalChannelType = Record<string, unknown>;
type LocalCommandType = string;
type LocalEventType = Record<string, unknown>;
type LocalMessageType = Record<string, unknown>;
type LocalReactionType = Record<string, unknown>;
type LocalUserType = Record<string, unknown>;

export type StreamChatGenerics = {
  attachmentType: LocalAttachmentType;
  channelType: LocalChannelType;
  commandType: LocalCommandType;
  eventType: LocalEventType;
  messageType: LocalMessageType;
  reactionType: LocalReactionType;
  userType: LocalUserType;
};

export const chatClient =
  StreamChat.getInstance<StreamChatGenerics>(LIVESTREAMAPIKEY);