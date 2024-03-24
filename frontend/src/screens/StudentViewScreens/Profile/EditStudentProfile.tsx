import { ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Button, Icon, useStyleSheet } from '@ui-kitten/components';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { ProfileSetting } from '../../../components/ProfileSetting';
import { ProfileAvatar } from '../../../components/ProfileAvatar';
import { EditStudentProfileProp } from '../../../types/types';
import { useLogout } from '../../../hooks/useLogout';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logIn } from '../../../redux/userSlice';
import { URL, VERSION } from '@env';
import validator from 'validator';
import { Colors, LoaderScreen } from 'react-native-ui-lib';

const EditStudentProfile = ({ navigation }: EditStudentProfileProp) => {
    const user = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();
    const styles = useStyleSheet(themedStyles);
    const { logout } = useLogout();
    const { showActionSheetWithOptions } = useActionSheet();
    const [selected, setSelected] = useState(false);
    const [deleteImage, setDeleteImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [image, setImage] = useState(user?.avatar);
    const [website, setWebsite] = useState(user?.website);
    const [bio, setBio] = useState(user?.bio);
    const [name, setName] = useState(user?.name);

    const onDoneButtonPress = (): void => {
        navigation && navigation.goBack();
    };

    const renderPhotoButton = (): React.ReactElement => (
        <Button
            style={styles.photoButton}
            size='small'
            status='basic'
            accessoryLeft={<Icon name='camera' />}
            onPress={actionSheet}
        />
    );

    const actionSheet = () => {
        showActionSheetWithOptions({
            options: ["Cancel", "Upload from library", "Delete current photo"],
            cancelButtonIndex: 0,
            destructiveButtonIndex: 2,
            userInterfaceStyle: 'dark'
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case 0:
                    // Cancel
                    break;
                case 1:
                    openImagePickerAsync();
                    break;
                case 2:
                    setImage("");
                    setSelected(false);
                    setDeleteImage(true);
            }
        });
    }

    const deleteProfilePicture = async () => {
        if (!user?.avatar) {
            null
        } else {
            try {
                let pictureRef = ref(getStorage(), user?.avatar);
                await deleteObject(pictureRef).then(() => {
                    console.log("Deletion Successful");
                })
            } catch (error) {
                console.log((error as Error).message);
            }
        }
    }

    //Handles picking profile image from gallery
    let openImagePickerAsync = async () => {
        Haptics.selectionAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setSelected(true);
            setDeleteImage(false);
        }

        if (result.canceled) {
            setImage(user?.avatar);
            setSelected(false);
            setDeleteImage(false);
        }
    };

    const handleImagePicked = async (pickerResult: string) => {
        let avatar;
        try {
            const uploadUrl = await uploadImage(pickerResult);
            avatar = uploadUrl;
        } catch (e) {
            console.log((e as Error).message);
            alert("Upload failed");
        }
        return avatar;
    };

    const uploadImage = async (uri: string) => {
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
    }

    const updateProfile = async () => {
        try {
            if (loading) return;
            setLoading(true);
            let avatar;
            if (deleteImage) {
                await deleteProfilePicture();
            }
            if (selected) {
                //Delete any picture that exists first
                await deleteProfilePicture().then(async () => avatar = await handleImagePicked(`${image}`))
                //then upload the new one

            } else {
                avatar = image
            }
            if (website) {
                if (!validator.isURL(website) || !website.startsWith("http")) {
                    alert("Website is not a valid URL");
                    setLoading(false);
                    return;
                }
            }
            let body = { name, avatar, website, bio };
            const response = await fetch(`${URL}/api/${VERSION}/user/updateProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(body)
            })

            const json = await response.json()
            const updatedUser = { ...json, token: user?.token }

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
                setError(json.error);
                setLoading(false);
            }
            if (response.ok) {
                //save user to react native local storage
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
                //update redux state
                dispatch(logIn(updatedUser));
                navigation.goBack();
            }

        } catch (error) {
            console.log((error as Error).message);
        }
        setLoading(false);
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <ProfileAvatar
                style={[styles.photo, { marginBottom: 35 }]}
                source={image}
                editButton={renderPhotoButton}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Name'
                value={`${name}`}
                type='input'
                onChangeText={(newValue) => setName(newValue)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Website'
                value={`${website}`}
                type='input'
                onChangeText={(newValue) => setWebsite(newValue)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Bio'
                value={`${bio}`}
                type='inputBio'
                onChangeText={(newValue) => setBio(newValue)}
            />
            <ProfileSetting
                style={[styles.setting, styles.emailSetting, { marginTop: 24 }]}
                hint='Email'
                value={`${user?.email}`}
            />
            <Button
                style={styles.doneButton}
                onPress={updateProfile}>
                SAVE
            </Button>
            {loading && <LoaderScreen color={Colors.blue30} message="" overlay />}
        </ScrollView>
    )
}

export default EditStudentProfile

const themedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 15
    },
    contentContainer: {
        paddingBottom: 24,
    },
    photoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    photo: {
        height: 110,
        width: 110,
        alignSelf: 'center',
    },
    photoButton: {
        aspectRatio: 1.0,
        height: 32,
        borderRadius: 16,
    },
    nameSection: {
        flex: 1,
        marginHorizontal: 8,
    },
    description: {
        padding: 24,
        backgroundColor: 'background-basic-color-1',
    },
    doneButton: {
        marginHorizontal: 24,
        marginTop: 24,
    },
    setting: {
        padding: 16,
    },
    emailSetting: {
        marginTop: 24,
    },
})