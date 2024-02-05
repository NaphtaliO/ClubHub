import { useDispatch } from "react-redux"
// import { setFeed } from "../state_management/feedSlice";
// import { setPosts } from "../state_management/postsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOut } from "../redux/userSlice";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            //remove user from react native storage
            await AsyncStorage.removeItem('user');
            // await AsyncStorage.removeItem('feed');
            //update redux state
            // TODO:
            // dispatch(setPosts([]));
            // dispatch(setFeed([]));
            dispatch(logOut());
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    return { logout }
}