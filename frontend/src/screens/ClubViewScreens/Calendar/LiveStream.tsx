import React, { useCallback, useEffect } from "react";
import {
    HostLivestream,
    LivestreamAudioControlButton,
    LivestreamVideoControlButton,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
    VideoRenderer,
    useCall,
    useCallStateHooks,
    useIncallManager,
} from "@stream-io/video-react-native-sdk";
import { SafeAreaView, Text, StyleSheet, View, Image, Platform, PermissionsAndroid, Button, TouchableOpacity } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";
import { LivestreamFlipControlButton } from "../../../components/LivestreamFlipControlButton";
import { useFocusEffect } from "@react-navigation/native";
import { Event, LiveStreamProps } from "../../../types/types";
import { socket } from "../../../socket";
import { LIVESTREAMAPIKEY } from "@env";


export default function LiveStream({ route }: LiveStreamProps) {
    const { event } = route.params
    const authUser = useAppSelector((state) => state.user.value);

    const apiKey = LIVESTREAMAPIKEY;
    const token = `${authUser?.token}`;
    const callId = `${event._id}`

    const user: User = {
        // any string can be used for the id
        id: `${authUser?._id}`,
        // name and image are used in the UI
        name: `${authUser?.name}`,
        image: `${authUser?.avatar}`,
        type: 'authenticated'
    };
    const myClient = new StreamVideoClient({ apiKey, user, token });
    const myCall = myClient.call("livestream", callId);
    myCall.join({ create: true });

    useEffect(() => {
        const run = async () => {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.requestMultiple([
                    'android.permission.POST_NOTIFICATIONS',
                    'android.permission.BLUETOOTH_CONNECT',
                ]);
            }
        };
        run();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                myCall.leave();
                myCall.endCall();
                myCall.stopLive();
            };
        }, [])
    );

    return (
        <StreamVideo client={myClient} language="en">
            <StreamCall call={myCall}>
                <SafeAreaView style={{ flex: 1 }}>
                    <LiveStreamUI event={event} />
                </SafeAreaView>
            </StreamCall>
        </StreamVideo>
    );
}

const LiveStreamUI = ({event}: {event: Event}) => {
    const { useCallIngress,
        useParticipantCount, useLocalParticipant, useIsCallLive } = useCallStateHooks();
    
    const ingress = useCallIngress();
    const rtmpURL = ingress?.rtmp.address;
    // const streamKey = token;
    const isCallLive = useIsCallLive()

    useEffect(() => {
        if (isCallLive) {
            socket.emit('streaming', { eventId: event._id });
        } else {
            socket.emit('stopStreaming', { eventId: event._id });
        }
        // console.log(isCallLive);
        
    }, [isCallLive, socket])

    return (
        <HostLivestream LivestreamMediaControls={() =>
        (<View style={{ flexDirection: 'row' }}>
            <LivestreamAudioControlButton />
            <LivestreamVideoControlButton />
            <LivestreamFlipControlButton />
        </View>)
        } />
    )
}