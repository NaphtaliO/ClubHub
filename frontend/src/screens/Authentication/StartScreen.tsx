import React from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { StartScreenProps } from '../../types/types';

export default function StartScreen({ navigation }: StartScreenProps) {
    return (
        <Background>
            <Logo />
            <Header>Login Template</Header>
            <Text style={styles.text}>The easiest way to start with your amazing application.</Text>
            <Button
                type="auth"
                mode="contained"
                onPress={() => navigation.navigate('LogIn')}
            >
                Login
            </Button>
            <Button
                type="auth"
                mode="outlined"
                onPress={() => navigation.navigate('CreateAccount')}
            >
                Sign Up
            </Button>
        </Background>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        lineHeight: 21,
        textAlign: 'center',
        marginBottom: 12,
    },
})