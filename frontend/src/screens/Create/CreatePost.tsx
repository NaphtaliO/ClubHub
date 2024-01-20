import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, ImageBackground, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
// import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { CreatePostScreenProps } from '../../types/types';
import ImageViewer from '../../components/ImageViewer';
// import { v4 as uuidv4 } from 'uuid';
// import 'react-native-get-random-values';
// import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// import { useDispatch, useSelector } from 'react-redux';
// import { createPosts } from '../../state_management/postsSlice';
// import { addToFeed } from '../../state_management/feedSlice';
// import { useLogout } from '../../hooks/useLogout';
// import { URL } from '@env';
// import { THEME_COLOUR } from '../../Constants';

export default function Post({ navigation }: CreatePostScreenProps) {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const hasUnsavedChanges = Boolean(caption || image);
    // const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.value);
    // const { logout } = useLogout()
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();

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
        // Haptics.selectionAsync()
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
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
            setImage(null);
            setSelected(false);
        }
    };

    // Handles opening camera/taking pictures
    let openCameraAsync = async () => {
        if (permission?.status !== "granted") {
            requestPermission();
        } else {
            // Haptics.selectionAsync()
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
                setImage(null);
                setSelected(false);
            }
        }
    };

    const handleCreate = async () => {
    //     if (loading) {
    //         return;
    //     }
    //     setLoading(true)
    //     try {
    //         if (user == null) {
    //             console.log("You need to be logged in");
    //             return;
    //         }
    //         let uri = null;
    //         if (selected) {
    //             uri = await handleImagePicked(image);
    //         }
    //         const post = { uri, caption }
    //         const response = await fetch(`${URL}/api/posts/create`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${user.token}`
    //             },
    //             body: JSON.stringify(post)
    //         })

    //         const json = await response.json()

    //         if (!response.ok) {
    //             if (json.error === "Request is not authorized") {
    //                 logout()
    //             }
    //         }
    //         if (response.ok) {
    //             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    //             dispatch(createPosts(json));
    //             dispatch(addToFeed({ name: user.name, username: user.username, avatar: user.avatar, ...json }))
    //         }
    //         navigation.navigate('Home');
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    //     setLoading(false)
    }

    const handleImagePicked = async (pickerResult: any) => {
    //     let avatar;
    //     try {
    //         if (pickerResult.cancelled) {
    //             alert("Upload cancelled");
    //             return;
    //         } else {
    //             const uploadUrl = await uploadImage(pickerResult);
    //             avatar = uploadUrl;
    //         }
    //     } catch (e) {
    //         console.log(e.message);
    //         alert("Upload failed");
    //     }
    //     return avatar;
    };

    const uploadImage = async (uri: string) => {
    //     try {
    //         const blob = await new Promise((resolve, reject) => {
    //             const xhr = new XMLHttpRequest();
    //             xhr.onload = function () {
    //                 resolve(xhr.response);
    //             };
    //             xhr.onerror = function (e) {
    //                 console.log(e);
    //                 reject(new TypeError("Network request failed"));
    //             };
    //             xhr.responseType = "blob";
    //             xhr.open("GET", uri, true);
    //             xhr.send(null);
    //         });

    //         const fileRef = ref(getStorage(), `${user._id}/${uuidv4()}`);
    //         const result = await uploadBytes(fileRef, blob);

    //         // We're done with the blob, close and release it
    //         blob.close();

    //         return await getDownloadURL(fileRef);
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    }

    const removeImage = () => {
        setImage(null);
        setSelected(false);
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={84}>
            <ScrollView style={styles.container} scrollEnabled={true}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write a caption..."
                        onChangeText={text => setCaption(text)}
                        multiline={true}
                        value={caption}
                        maxLength={500}
                    />
                    {image === null ? null : 
                    <ImageViewer image={image} removeImage={removeImage}/>
                    }
                    
                    <View style={styles.footerContainer}>
                        <Button theme="primary" label="photo/video" onPress={openImagePickerAsync} />
                        {/* <Button label="Use this photo" /> */}
                    </View>
                     {/* <View style={styles.icon} >
                        <TouchableOpacity onPress={openImagePickerAsync} style={{}}>
                            <FontAwesome name="image" size={40} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openCameraAsync} style={{ marginLeft: 30 }}>
                            <FontAwesome name="camera" size={40} color="black" />
                        </TouchableOpacity>
                    </View> */}
                {/* <View style={{
                    paddingBottom: 30
                }}>
                    {image !== null || caption !== "" ?
                        <TouchableOpacity onPress={handleCreate}>
                            <View style={styles.buttonContainer}>
                                {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
                                    :
                                    <Text style={styles.button}>Share Post</Text>}
                            </View>
                        </TouchableOpacity>
                        : null}  */}
                {/* </View> */}
            </ScrollView>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    footerContainer: {
        paddingTop: 'auto',
        alignSelf: 'center',
    },
    textInput: {
        fontSize: 20,
        letterSpacing: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: '#3AB0FF',
        borderRadius: 10,
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    }
});