import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, ImageBackground, Platform, Image as RNImage } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { CreatePostScreenProps } from '../../../types/types';
import TouchableIcon from '../../../components/TouchableIcon';
import { Button } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import { useAppSelector } from '../../../hooks/hooks';
import CustomToast, { ToastContext } from '../../../components/CustomToast';

export default function Post({ navigation }: CreatePostScreenProps) {
    const user = useAppSelector((state) => state.user.value);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);
    // const hasUnsavedChanges = Boolean(!caption && !image);
    const { logout } = useLogout();
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const displayToast  = useContext(ToastContext);

    // useEffect(() => {
    //     navigation.addListener('beforeRemove', (e) => {
    //         if (!hasUnsavedChanges) {
    //             return;
    //         }

    //         e.preventDefault();

    //         Alert.alert(
    //             "Discard Post?",
    //             "You have unsaved changes, would you like to discard post?",
    //             [
    //                 {
    //                     text: "Keep Editing",
    //                     onPress: () => { }
    //                 },
    //                 {
    //                     text: "Discard Post",
    //                     onPress: () => navigation.dispatch(e.data.action),
    //                     style: "destructive"
    //                 }
    //             ]
    //         );
    //     })
    // }, [navigation, hasUnsavedChanges]);

    //Handles picking images from Gallery
    let openImagePickerAsync = async () => {
        Haptics.selectionAsync()
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsMultipleSelection: true,
            // allowsEditing: true,
            presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
            aspect: [4, 3],
            quality: 0,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setSelected(true);
        }

        if (result.canceled) {
            setImage(undefined);
            setSelected(false);
        }
    };

    // Handles opening camera/taking pictures
    let openCameraAsync = async () => {
        if (permission?.status !== "granted") {
            requestPermission();
        } else {
            Haptics.selectionAsync()
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 0.2,
                cameraType: ImagePicker.CameraType.front
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                setSelected(true);
            }

            if (result.canceled) {
                setImage(undefined);
                setSelected(false);
            }
        }
    };

    const handleCreate = async () => {
        try {
            let uri = null;
            if (selected) uri = await handleImagePicked(image);
            if (!uri || !caption) {
                displayToast?.displayToast("Select both an image and caption", "failure")
                return;
            }
            const post = { uri, caption, type: "image" }

            const response = await fetch(`${URL}/api/${VERSION}/post/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(post)
            })
            // return;
            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                displayToast?.displayToast("Post successfully created", "success")
            }
            navigation.navigate('ClubViewTabNav', { screen: 'Home' });
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const create = () => {
        // if (loading) return;
        setLoading(true);
        handleCreate();
        setLoading(false);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                // TODO: Fix this. 
                // Implement a way to show loading when post button is clicked
                // Do the same for Creating new event
                <Button mode="contained"
                    onPress={handleCreate}
                    loading={loading}
                >
                    Post
                </Button>
            ),
        });
    }, [navigation, loading, handleCreate]);

    const handleImagePicked = async (pickerResult: any) => {
        let avatar;
        try {
            if (pickerResult.cancelled) {
                alert("Upload cancelled");
                return;
            } else {
                const uploadUrl = await uploadImage(pickerResult);
                avatar = uploadUrl;
            }
        } catch (e) {
            console.log((e as Error).message);
            alert("Upload failed");
        }
        return avatar;
    };

    const uploadImage = async (uri: string) => {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            const fileRef = ref(getStorage(), `${user?._id}/${uuidv4()}`);
            const result = await uploadBytes(fileRef, blob);

            // We're done with the blob, close and release it
            blob.close();

            return await getDownloadURL(fileRef);
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const removeImage = () => {
        // TODO: remove image
        setImage(undefined);
        setSelected(false);
    }

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={84}>
            <View style={{ marginHorizontal: 17, marginTop: 17 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RNImage style={styles.avatar}
                        source={require('../../../assets/soccer.jpeg')} />
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{user?.name}</Text>
                </View>
                <TextInput
                    style={styles.caption}
                    placeholder="Write a caption..."
                    onChangeText={text => setCaption(text)}
                    multiline
                    value={caption}
                    numberOfLines={4}
                    maxLength={500}
                    editable />
                {image ?
                    // <Image
                    //     customOverlayContent={
                    //         <View style={{marginLeft: 'auto', padding: 5}}>
                    //             <TouchableIcon name='delete' onPress={() => {}} />
                    //         </View>
                    //     }
                    //     source={{ uri: image }}
                    // style={styles.image} />
                    <RNImage style={styles.image} source={{ uri: image }} resizeMode='cover' />
                    : null}
            </View>

            <View style={{ marginTop: 'auto', marginHorizontal: 35, marginBottom: 20, flexDirection: 'row' }}>
                <TouchableIcon name="photo" onPress={openImagePickerAsync} style={styles.bottomIcon} />
                <TouchableIcon name="camera" onPress={openCameraAsync} style={styles.bottomIcon} />
            </View>
            {/* TODO: Work on Custom Toast Provider
            {showToast && <CustomToast setShowToast={setShowToast} showToast={showToast} />} */}
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 15
    },
    caption: {
        marginVertical: 15,
        fontSize: 20,
        letterSpacing: .7,
    },
    image: {
        width: '100%',
        // height: 400,
        borderRadius: 10,
        aspectRatio: 4/3
    },
    bottomIcon: {
        marginRight: 35
    }
});