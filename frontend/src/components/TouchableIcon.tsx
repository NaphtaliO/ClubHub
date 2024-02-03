import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

type Prop = {
    onPress: () => void,
    name: string,
    style?: object
}

const TouchableIcon = ({ onPress, name, style }: Prop) => {
    if (name === "photo") {
        return (
            <TouchableOpacity onPress={onPress} style={style}>
                <FontAwesome name="photo" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    if (name === "camera") {
        return (
            <TouchableOpacity onPress={onPress} style={style}>
                <FontAwesome name="camera" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    if (name === "delete") {
        return (
            <TouchableOpacity onPress={onPress} style={style}>
                <MaterialCommunityIcons name="delete-circle" size={35} color="white" />
            </TouchableOpacity>
        )
    }

    

}

export default TouchableIcon;

const styles = StyleSheet.create({
    
})