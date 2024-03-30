import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOut } from "../redux/userSlice";
import { chatClient } from "../types/types";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            // remove user from react native storage
            // remove user from redux state
            await AsyncStorage.removeItem('user');
            dispatch(logOut());
            // Remove device for push notification
            const token = await AsyncStorage.getItem('@current_push_token');
            if (token !== null) {
                await chatClient.removeDevice(token);
            }
            await chatClient.disconnectUser();
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    return { logout }
}