import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
    return <Image source={require('../assets/ucc_logo.png')} style={styles.image}/>
}

const styles = StyleSheet.create({
    image: {
        width: 210,
        height: 110,
        marginBottom: 8,
    },
})