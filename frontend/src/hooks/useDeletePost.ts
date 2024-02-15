import { getStorage, ref, deleteObject } from 'firebase/storage';
import { URL, VERSION } from '@env';
import { Alert } from "react-native";
import { useAppSelector } from "./hooks";
import { useLogout } from './useLogout';

export const useDeletePost = () => {
    const user = useAppSelector((state) => state.user.value);
    const { logout } = useLogout();

    const deleteFromFirebase = async (url: string) => {
        if (url === null || url === "") {
            null
        } else {
            try {
                let pictureRef = ref(getStorage(), url);
                await deleteObject(pictureRef).then(() => {
                    console.log("Deletion Successful");
                })
            } catch (error) {
                console.log((error as Error).message);
            }
        }
    }

    const deletePostUI = async (id: string, uri: string) => {
        Alert.alert('Delete this post?', '', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            {
                text: 'Delete', style: 'default', onPress: async () => {
                    await deleteFromFirebase(uri)
                    try {
                        const response = await fetch(`${URL}/api/${VERSION}/post/deletePost/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${user?.token}`
                            },
                        });
                        const json = await response.json()

                        if (!response.ok) {
                            if (json.error === "Request is not authorized") {
                                logout()
                            }
                        }
                        if (response.ok) {
                            return json
                        }
                    } catch (error) {
                        console.log((error as Error).message);
                    }
                }
            }
        ])
    };

    return { deletePostUI }
}