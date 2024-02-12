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
import { useDispatch, useSelector } from 'react-redux';
// import { useAppSelector, useAppDispatch } from './src/hooks/hooks';
import { logIn } from './src/redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateEvent from './src/screens/ClubViewScreens/Create/CreateEvent';
import { useLogout } from './src/hooks/useLogout';
import ClubViewTabNav from './src/navigation/ClubViewTabNav';
import StudentViewTabNav from './src/navigation/StudentViewTabNav';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
                        <Stack.Screen name="ClubViewTabNav" component={ClubViewTabNav}
                            options={{
                                headerShown: false,
                            }} />
                        <Stack.Screen name="CreatePost" component={CreatePost}
                            options={{ headerTitle: "New Post" }} />
                        <Stack.Screen name="CreateEvent" component={CreateEvent}
                            options={{ headerTitle: "New Event" }} />
                    </>
                ) : user && user.type === "student" ? (
                    <>
                            <Stack.Screen name="StudentViewTabNav" component={StudentViewTabNav}
                                options={{
                                    headerShown: false,
                                }} />
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