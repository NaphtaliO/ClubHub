import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOut } from "../redux/userSlice";
import { chatClient } from "../types/types";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            //remove user from react native storage
            //remove user from redux state
            await chatClient.disconnectUser();
            await AsyncStorage.removeItem('user');
            dispatch(logOut());
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    return { logout }
}