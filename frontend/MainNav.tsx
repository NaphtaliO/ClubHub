import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from './src/types/types';
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
import LiveStream from './src/screens/ClubViewScreens/Calendar/LiveStream';
import WatchLiveStream from './src/screens/StudentViewScreens/Calendar/WatchLiveStream';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNav = () => {
    const [loading, setLoading] = useState(false);
    const user = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();

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

    if (loading) return <ActivityIndicator animating={true} color={MD2Colors.red800} />;

    return (
        <>
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
                            options={{ presentation: 'modal', headerLeft: () => null, headerTitle: 'Comments' }}/>
                        <Stack.Screen name="LiveStream" component={LiveStream}
                            options={{ headerTitle: "Go Live", headerShown: false }} />
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
        </>
    );
};

export default MainNav;