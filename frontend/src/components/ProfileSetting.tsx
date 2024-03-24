import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Divider, Layout, LayoutProps, Text } from '@ui-kitten/components';

export interface ProfileSettingProps extends LayoutProps {
    hint?: string;
    value: string;
    type?: "input" | "inputBio";
    onChangeText?: (value: string) => void;
}

export const ProfileSetting = (props: ProfileSettingProps): React.ReactElement => {

    const { style, hint, value, type, onChangeText, ...layoutProps } = props;

    const renderHintElement = (): React.ReactElement => (
        <Text
            appearance='hint'
            category='s1'>
            {hint}
        </Text>
    );

    if (type === "input") {
        return (
            <React.Fragment>
                <Layout
                    level='1'
                    {...layoutProps}
                    style={[styles.container, style]}>
                    {hint && renderHintElement()}
                    <View style={{ marginLeft: 'auto', width: '70%' }}>
                        <TextInput
                            style={{ fontSize: 15, fontWeight: '600', color: '#222B45' }}
                            placeholder={hint}
                            value={value}
                            onChangeText={onChangeText}
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearTextOnFocus={false}
                        />
                    </View>

                </Layout>
                <Divider />
            </React.Fragment>
        );
    }

    if (type === "inputBio") {
        return (
            <React.Fragment>
                <Layout
                    level='1'
                    {...layoutProps}
                    style={[styles.container, style]}>
                    {hint && renderHintElement()}
                    <View style={{ marginLeft: 'auto', width: '70%' }}>
                        <TextInput
                            style={{ fontSize: 15, fontWeight: '600', color: '#222B45' }}
                            placeholder={hint}
                            value={value}
                            onChangeText={onChangeText}
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearTextOnFocus={false}
                            multiline={true}
                            maxLength={200}
                        />
                    </View>

                </Layout>
                <Divider />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Layout
                level='1'
                {...layoutProps}
                style={[styles.container, style]}>
                {hint && renderHintElement()}
                <View style={{ marginLeft: 'auto', width: '70%' }}>
                    <Text category='s1'>
                        {value}
                    </Text>
                </View>
            </Layout>
            <Divider />
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});