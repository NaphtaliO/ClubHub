import React from 'react';
import { View, StyleSheet, Text, TextInputProps as RNTextInputProps } from 'react-native';
import { TextInput as Input, TextInputProps } from 'react-native-paper';
import { theme } from '../Constants';

type TextInputProp = {
    errorText?: string,
    description?: string | undefined
    autoCompleteType?: string
}

type CombinedProps = TextInputProp & TextInputProps & RNTextInputProps;

export default function TextInput({ errorText, description, ...props }: CombinedProps) {
    
    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                {...props}
            />
            {/* {description && !errorText ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null} */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 12,
    },
    input: {
        backgroundColor: theme.colors.surface,
    },
    description: {
        fontSize: 13,
        color: theme.colors.secondary,
        paddingTop: 8,
    },
    error: {
        fontSize: 13,
        color: theme.colors.error,
        paddingTop: 8,
    },
})