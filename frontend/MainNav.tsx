import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Feed from './src/screens/Home/Feed';
import Search from './src/screens/Search/Search';
import Profile from './src/screens/Profile/Profile';
import { RootStackParamList, RootTabParamList } from './src/types/types';
import Calendar from './src/screens/Calendar/EventsScreen';
import Create from './src/screens/Create/Create';
import EventsScreen from './src/screens/Calendar/EventsScreen';
import CreatePost from './src/screens/Create/CreatePost';
import { useActionSheet } from '@expo/react-native-action-sheet';
import CreateAccount from './src/screens/Authentication/CreateAccount';
import LogIn from './src/screens/Authentication/LogIn';
import StartScreen from './src/screens/Authentication/StartScreen';
import { useDispatch, useSelector } from 'react-redux';
// import { useAppSelector, useAppDispatch } from './src/hooks/hooks';
import { logIn } from './src/redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();


const TabNav = ({ }) => {
    const { showActionSheetWithOptions } = useActionSheet();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === "Home") {
                        return <Foundation name="home" size={size} color={color} />;
                    }
                    if (route.name === "Create") {
                        return <MaterialIcons name="add-circle-outline" size={size} color={color} />;
                    }
                    if (route.name === "Calendar") {
                        return <Feather name="calendar" size={size} color={color} />;
                    }
                    if (route.name === "Profile") {
                        return <Ionicons name="person-outline" size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: "flex",
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Feed}
                options={{
                    headerTitle: "ClubHub",
                }}
            />
            <Tab.Screen
                name="Create"
                component={Feed}
                options={{}}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        showActionSheetWithOptions({
                            options: ['Create a post', 'Create a event', 'Send Notification', 'Cancel'],
                            cancelButtonIndex: 3,
                            // destructiveButtonIndex: 0
                        }, (selectedIndex) => {
                            switch (selectedIndex) {
                                case 0:
                                    navigation.navigate('CreatePost')
                                    break;
                                case 1:
                                    // Delete
                                    break;
                                case 2:
                                // Canceled
                            }
                        });
                    },
                })}
            />
            <Tab.Screen
                name="Calendar"
                component={EventsScreen}
            // options={{
            //     headerShown: false,
            // }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
            // options={{
            //     headerRight: () => (
            //         <TouchableOpacity onPress={() => navigation.navigate("")}>
            //             <Ionicons
            //                 name="ios-settings-outline"
            //                 size={24}
            //                 color="black"
            //                 style={{ marginRight: 15 }}
            //             />
            //         </TouchableOpacity>
            //     )
            // }}
            />
        </Tab.Navigator>
    );
};

const MainNav = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value);
    
    const dispatch = useDispatch();

    useEffect(() => {
        const getData = async () => {
            
            if (loading) return;
            setLoading(true);
            try {
                const user = JSON.parse(await AsyncStorage.getItem("user"));
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
                        <Stack.Screen name="TabNav" component={TabNav}
                            options={{
                                headerShown: false,
                            }}/>
                        <Stack.Screen name="CreatePost" component={CreatePost} />
                    </>
                ) : user && user.type === "student" ? (
                        <>
                        </>
                ): (
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