import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCall, useCallStateHooks } from '@stream-io/video-react-bindings';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

/**
 * The LivestreamAudioControlButton controls the audio stream publish/unpublish while in the livestream for the host.
 */
export const LivestreamFlipControlButton = () => {
    const call = useCall();
    const { useCameraState } = useCallStateHooks();
    const { camera } = useCameraState();

    const onPress = async () => {
        await camera.flip();
    };

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: "#1C1E22",
                    height: 40,
                    width: 40,
                },
            ]}
        >
            <View
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <MaterialCommunityIcons name="camera-flip" size={24} color="white" />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        borderRadius: 4,
    },
    icon: {},
});