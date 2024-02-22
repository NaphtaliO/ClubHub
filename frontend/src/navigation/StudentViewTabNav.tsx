import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StudentViewTabParamList } from "../types/types";
import { useLogout } from "../hooks/useLogout";
import { Feather, FontAwesome, Foundation, Ionicons } from "@expo/vector-icons";
import Search from "../screens/StudentViewScreens/Search/Search";
import { TouchableOpacity } from "react-native";
import Profile from "../screens/StudentViewScreens/Profile/Profile";
import Calendar from "../screens/StudentViewScreens/Calendar/Calendar";
import Home from "../screens/StudentViewScreens/Home/Home";

const Tab = createBottomTabNavigator<StudentViewTabParamList>();

const StudentViewTabNav = ({ }) => {
    const { logout } = useLogout()

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === "Home") {
                        return <Foundation name="home" size={size} color={color} />;
                    }
                    if (route.name === "Search") {
                        return <FontAwesome name="search" size={size} color={color} />;
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
                component={Home}
                options={{
                    headerTitle: "ClubHub",
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={Calendar}
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
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default StudentViewTabNav;