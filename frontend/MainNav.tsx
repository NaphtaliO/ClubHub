import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, StreamChatGenerics, chatClient } from './src/types/types';
import CreatePost from './src/screens/ClubViewScreens/Create/CreatePost';
import CreateAccount from './src/screens/Authentication/CreateAccount';
import LogIn from './src/screens/Authentication/LogIn';
import StartScreen from './src/screens/Authentication/StartScreen';
import { useAppSelector, useAppDispatch } from './src/hooks/hooks';
import { logIn } from './src/redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateEvent from './src/screens/ClubViewScreens/Create/CreateEvent';
import ClubViewTabNav from './src/navigation/ClubViewTabNav';
import StudentViewTabNav from './src/navigation/StudentViewTabNav';
import ClubProfile from './src/screens/StudentViewScreens/Profile/ClubProfile';
import EditClubProfile from './src/screens/ClubViewScreens/Profile/EditClubProfile';
import EventDetails from './src/screens/ClubViewScreens/Calendar/EventDetails';
import CalendarEventDetails from './src/screens/StudentViewScreens/Calendar/CalendarEventDetails';
import TermsAndConditions from './src/components/TermsAndConditions';
import ClubCommentsScreen from './src/screens/ClubViewScreens/Home/ClubCommentsScreen';
import NotificationScreen from './src/screens/StudentViewScreens/Home/NotificationScreen';
import SendNotification from './src/screens/ClubViewScreens/Create/SendNotification';
import NotificationDetails from './src/screens/StudentViewScreens/Home/NotificationDetails';
import StudentChannelList from './src/screens/StudentViewScreens/Home/StudentChannelList';
import { Channel, Chat, OverlayProvider } from 'stream-chat-expo';
import { useChatClient } from './src/hooks/useChatClient';
import StudentChannel from './src/screens/StudentViewScreens/Home/StudentChannel';
import { ChannelListHeader } from './src/components/ChannelListHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewMessageScreen } from './src/screens/StudentViewScreens/Home/NewMessageScreen';
import { NewMessageProvider } from './src/context/NewMessageContext';
import { Image } from 'expo-image';
import { useAppContext } from './src/context/AppContext';
import { ChannelHeader } from './src/components/ChannelHeader';
import ClubChannel from './src/screens/ClubViewScreens/Home/ClubChannel';
import ClubChannelList from './src/screens/ClubViewScreens/Home/ClubChannelList';
import ThreadScreen from './src/screens/StudentViewScreens/Home/ThreadScreen';
import StudentCommentsScreen from './src/screens/StudentViewScreens/Home/StudentCommentsScreen';
import LiveStream from './src/screens/ClubViewScreens/Calendar/LiveStream';
import WatchLiveStream from './src/screens/StudentViewScreens/Calendar/WatchLiveStream';
import EditStudentProfile from './src/screens/StudentViewScreens/Profile/EditStudentProfile';
import StudentSettings from './src/screens/StudentViewScreens/Profile/Settings/StudentSettings';
import DeleteAccount from './src/screens/StudentViewScreens/Profile/Settings/DeleteAccount';
import NotificationSettings from './src/screens/StudentViewScreens/Profile/Settings/NotificationSettings';

export const CHANNEL_LIST_SCREEN_HEADER_HEIGHT = 120;
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNav = () => {
    const [loading, setLoading] = useState(false);
    const user = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const { clientIsReady } = useChatClient();
    const { channel } = useAppContext();

    useEffect(() => {
        const getData = async () => {
            if (loading) return;
            setLoading(true);
            try {
                const user = JSON.parse(await AsyncStorage.getItem("user") as string);
                if (user) {
                    dispatch(logIn(user));
                }
            } catch (error) {
                console.log((error as Error).message);
            }
            setLoading(false);
        }
        getData()
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                <ActivityIndicator size={30} animating={true} color={MD2Colors.red800} />
            </View>
            
        )
    };

    return (
        <>
            <OverlayProvider>
                <NewMessageProvider>
                    <Chat client={chatClient} ImageComponent={Image}>
                        <Stack.Navigator
                            screenOptions={({ navigation }) => ({
                                headerLeft: () => (
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Ionicons
                                            name="chevron-back"
                                            size={26}
                                            color="black"
                                            style={{}}
                                        />
                                    </TouchableOpacity>
                                )
                            })}>
                            {user && user.type === "club" ? (
                                <>
                                    {!user?.acceptedTerms ? <Stack.Screen name="TermsAndConditions"
                                        component={TermsAndConditions}
                                        options={{
                                            // headerShown: false,
                                            headerLeft: () => null
                                        }} /> : null}
                                    <Stack.Screen name="ClubViewTabNav" component={ClubViewTabNav}
                                        options={{
                                            headerShown: false,
                                        }} />
                                    <Stack.Screen name="CreatePost" component={CreatePost}
                                        options={{ headerTitle: "New Post" }} />
                                    <Stack.Screen name="CreateEvent" component={CreateEvent}
                                        options={{ headerTitle: "New Event" }} />
                                    <Stack.Screen name="EditClubProfile" component={EditClubProfile}
                                        options={{ headerTitle: "New Event" }} />
                                    <Stack.Screen name="EventDetails" component={EventDetails}
                                        options={{ headerTitle: "Event Details" }} />
                                    <Stack.Screen name="ClubCommentsScreen" component={ClubCommentsScreen}
                                        options={{ presentation: 'modal', headerLeft: () => null, headerTitle: 'Comments' }} />
                                    <Stack.Screen name="LiveStream" component={LiveStream}
                                        options={{ headerTitle: "Go Live", headerShown: false }} />
                                    <Stack.Screen name="SendNotification" component={SendNotification}
                                        options={{ headerTitle: "New Notification" }} />
                                    <Stack.Screen name='ClubChannelList' component={ClubChannelList}
                                        options={{
                                            headerTitle: "Messages", header: () => (
                                                <View
                                                    style={{
                                                        paddingTop: insets.top,
                                                        height: CHANNEL_LIST_SCREEN_HEADER_HEIGHT + insets.top,
                                                        backgroundColor: 'white',
                                                    }}>
                                                    <ChannelListHeader />
                                                </View>
                                            ),
                                        }} />
                                    <Stack.Screen name="ClubChannel" component={ClubChannel}
                                        options={{
                                            header: props =>
                                                !!insets.top && (
                                                    <View
                                                        style={{
                                                            paddingTop: insets.top,
                                                            height: 80 + insets.top,
                                                        }}>
                                                        <Channel channel={channel}>
                                                            <ChannelHeader {...props} channel={channel} />
                                                        </Channel>
                                                    </View>
                                                ),
                                        }} />
                                    {/* <Stack.Screen name="NewMessageScreen" component={NewMessageScreen}
                                        options={{ presentation: 'modal', headerTitle: 'New Message' }} /> */}
                                </>
                            ) : user && user.type === "student" ? (
                                <>
                                    {!user?.acceptedTerms ? <Stack.Screen name="TermsAndConditions"
                                        component={TermsAndConditions}
                                        options={{
                                            // headerShown: false,
                                            headerLeft: () => null
                                        }} /> : null}
                                    <Stack.Screen name="StudentViewTabNav" component={StudentViewTabNav}
                                        options={{
                                            headerShown: false,
                                        }} />
                                    <Stack.Screen name="ClubProfile" component={ClubProfile} options={({ navigation, route }) => ({
                                        title: route.params.name
                                    })} />
                                    <Stack.Screen name="CalendarEventDetails" component={CalendarEventDetails}
                                        options={{ headerTitle: "Event Details" }} />
                                    <Stack.Screen name="WatchLiveStream" component={WatchLiveStream}
                                        options={{ headerTitle: "Watch Live", headerShown: false }} />
                                    <Stack.Screen name="NotificationScreen" component={NotificationScreen}
                                        options={{ headerTitle: "Notifications" }} />
                                    <Stack.Screen name="NotificationDetails" component={NotificationDetails}
                                        options={{ headerTitle: "Details" }} />
                                    <Stack.Screen name='StudentChannelList' component={StudentChannelList}
                                        options={{
                                            headerTitle: "Messages", header: () => (
                                                <View
                                                    style={{
                                                        paddingTop: insets.top,
                                                        height: CHANNEL_LIST_SCREEN_HEADER_HEIGHT + insets.top,
                                                        backgroundColor: 'white',
                                                    }}>
                                                    <ChannelListHeader />
                                                </View>
                                            ),
                                        }} />
                                    <Stack.Screen name="StudentChannel" component={StudentChannel}
                                        options={{
                                            header: props =>
                                                !!insets.top && (
                                                    <View
                                                        style={{
                                                            paddingTop: insets.top,
                                                            height: 80 + insets.top,
                                                        }}>
                                                        <Channel channel={channel}>
                                                            <ChannelHeader {...props} channel={channel} />
                                                        </Channel>
                                                    </View>
                                                ),
                                        }} />
                                    <Stack.Screen name="NewMessageScreen" component={NewMessageScreen}
                                        options={{ presentation: 'modal', headerTitle: 'New Message' }} />
                                    {/* <Stack.Screen name="ThreadScreen" component={ThreadScreen} /> */}
                                    <Stack.Screen name="StudentCommentsScreen" component={StudentCommentsScreen}
                                        options={{ presentation: 'modal', headerLeft: () => null, headerTitle: 'Comments' }} />
                                    <Stack.Screen name="EditStudentProfile" component={EditStudentProfile}
                                            options={{}} />
                                        <Stack.Screen name="StudentSettings" component={StudentSettings}
                                            options={{ headerTitle: "Settings" }} />
                                        <Stack.Screen name="DeleteAccount" component={DeleteAccount}
                                            options={{ headerTitle: "Delete Account" }} />
                                        <Stack.Screen name="NotificationSettings" component={NotificationSettings}
                                            options={{ headerTitle: "Settings" }} />
                                </>
                            ) : (
                                <>
                                    <Stack.Screen
                                        name="StartScreen"
                                        component={StartScreen}
                                        options={{
                                            headerShown: false,
                                        }}
                                    />
                                    <Stack.Screen
                                        name="LogIn"
                                        component={LogIn}
                                        options={{
                                            headerShown: false,
                                        }}
                                    />
                                    <Stack.Screen
                                        name="CreateAccount"
                                        component={CreateAccount}
                                        options={{
                                            headerShown: false,
                                        }}
                                    />
                                </>
                            )}
                        </Stack.Navigator>
                    </Chat>
                </NewMessageProvider>
            </OverlayProvider>
        </>
    );
};

export default MainNav;