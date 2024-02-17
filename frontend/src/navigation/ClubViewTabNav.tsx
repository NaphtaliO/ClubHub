import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ClubViewTabParamList } from "../types/types";
import { useLogout } from "../hooks/useLogout";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Feather, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Feed from "../screens/ClubViewScreens/Home/Feed";
import CameraScreen from "../screens/ClubViewScreens/Create/CameraScreen";
import EventsScreen from "../screens/ClubViewScreens/Calendar/EventsScreen";
import Profile from "../screens/ClubViewScreens/Profile/Profile";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator<ClubViewTabParamList>();

const ClubViewTabNav = ({ }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const { logout } = useLogout();

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
                component={CameraScreen}
                options={{}}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        showActionSheetWithOptions({
                            options: ['Create a post', 'Create an event', 'Send Notification', 'Cancel'],
                            cancelButtonIndex: 3,
                            // destructiveButtonIndex: 0
                        }, (selectedIndex) => {
                            switch (selectedIndex) {
                                case 0:
                                    navigation.navigate('CreatePost')
                                    break;
                                case 1:
                                    navigation.navigate('CreateEvent')
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
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={logout}>
                            <Feather name="settings"
                                size={24}
                                color="black"
                                style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default ClubViewTabNav;