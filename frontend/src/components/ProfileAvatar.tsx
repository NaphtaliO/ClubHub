import React from 'react';
import { StyleSheet, View, ViewProps, Image as RNImage } from 'react-native';
import { Avatar, AvatarProps, ButtonElement, ButtonProps } from '@ui-kitten/components';
import { Image } from 'expo-image';

export interface ProfileAvatarProps extends AvatarProps {
    editButton?: () => ButtonElement;
}

export const ProfileAvatar = (props: ProfileAvatarProps): React.ReactElement<ViewProps> => {

    const renderEditButtonElement = (): ButtonElement => {
        const buttonElement: React.ReactElement<ButtonProps> = props.editButton();

        return React.cloneElement(buttonElement, {
            style: [buttonElement.props.style, styles.editButton],
        });
    };

    const { style, editButton, source } = props;

    return (
        <View style={style}>
            {!source ?
                <RNImage style={[style, styles.avatar]} source={require('../assets/default_avatar.png')} /> :
                <Image style={[style, styles.avatar]} source={source}/> }
            {editButton && renderEditButtonElement()}
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        alignSelf: 'center',
        borderRadius: 50
    },
    editButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,
    },
});