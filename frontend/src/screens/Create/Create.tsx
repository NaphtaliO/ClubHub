import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME_COLOUR } from '../../Constants';
import { CreateScreenProps } from '../../types/types';

const Create = ({ navigation }: CreateScreenProps) => {
    const list = [
        { title: 'Create Posts', image: '', onclick: () => navigation.navigate("CreatePost") },
        { title: 'Create Event', image: '' },
        { title: 'Send Notification', image: '' }
    ]

    return (
        <ScrollView style={styles.container}>
            {
                list.map((item, i) => (
                    <TouchableOpacity key={i} onPress={item.onclick}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.button}>{ item.title }</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </ScrollView>
    )
}

export default Create

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 20,
        marginTop: 17,
        backgroundColor: THEME_COLOUR,
        borderRadius: 10,
        width: '80%'
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "700",
        fontSize: 17
    },
})