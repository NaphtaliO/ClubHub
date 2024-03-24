import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { Avatar, Button, Icon, IconElement, Layout, Text, useStyleSheet } from '@ui-kitten/components'
import { useAppSelector } from '../../../hooks/hooks';
import { ProfileSetting } from '../../../components/ProfileSetting';
import { ProfileAvatar } from '../../../components/ProfileAvatar';
import { EditStudentProfileProp } from '../../../types/types';
import { ImageStyle } from 'expo-image';

const EditStudentProfile = ({ navigation }: EditStudentProfileProp) => {
    const user = useAppSelector((state) => state.user.value);
    const styles = useStyleSheet(themedStyles);

    const onDoneButtonPress = (): void => {
        navigation && navigation.goBack();
    };

    const CameraIcon = (style: ImageStyle): IconElement => (
        <Icon {...style} name='camera' />
    );

    const renderPhotoButton = (): React.ReactElement => (
        <Button
            style={styles.photoButton}
            size='small'
            status='basic'
            accessoryLeft={CameraIcon}
        />
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <Layout
                style={styles.photoSection}
                level='1'>
                <ProfileAvatar
                    style={styles.photo}
                    source={user?.avatar}
                    editButton={renderPhotoButton}
                />
                <View style={styles.nameSection}>
                    <ProfileSetting
                        style={styles.setting}
                        value={user?.name}
                    />
                    {/* <ProfileSetting
                        style={styles.setting}
                        value={profile.lastName}
                    /> */}
                </View>
            </Layout>
            <Text
                style={styles.description}
                appearance='hint'>
                'Hi! My name is Jennifer. I’m 25 and I live in Berlin. I’m interested in computer science, music, sport and fantasy literature.'
            </Text>
            <ProfileSetting
                style={[styles.setting, styles.emailSetting]}
                hint='Email'
                value={user?.email}
            />
            {/* <ProfileSetting
                style={styles.setting}
                hint='Gender'
                value={profile.gender}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Age'
                value={`${profile.age}`}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Weight'
                value={`${profile.weight} kg`}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Height'
                value={`${profile.height} cm`}
            /> */}
            <Button
                style={styles.doneButton}
                onPress={onDoneButtonPress}>
                DONE
            </Button>
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
        aspectRatio: 1.0,
        height: 76,
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