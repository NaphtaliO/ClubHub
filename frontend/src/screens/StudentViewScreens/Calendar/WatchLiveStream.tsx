import React, { useCallback, useEffect } from "react";
import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
    ViewerLivestream,
    useCall,
    useCallStateHooks,
    useIncallManager,
} from "@stream-io/video-react-native-sdk";
import { SafeAreaView, Platform, PermissionsAndroid } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { Event, WatchLiveStreamProps } from "../../../types/types";
import { socket } from "../../../socket";
import { LIVESTREAMAPIKEY } from "@env";


export default function WatchLiveStream({ route }: WatchLiveStreamProps) {
    const { event } = route.params;
    const authUser = useAppSelector((state) => state.user.value);

    const apiKey = LIVESTREAMAPIKEY;
    const token = `${authUser?.token}`;
    const callId = `${event._id}`;
    console.log(callId);
    

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

    // useEffect(() => {
    //     if (myCall)
    // },[])

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
                    <WatchLiveStreamUI event={event} />
                </SafeAreaView>
            </StreamCall>
        </StreamVideo>
    );
}

const WatchLiveStreamUI = ({ event }: { event: Event }) => {
    const { useCallIngress,
        useParticipantCount, useLocalParticipant, useIsCallLive } = useCallStateHooks();

    const ingress = useCallIngress();
    const rtmpURL = ingress?.rtmp.address;
    // const streamKey = token;
    const isCallLive = useIsCallLive();

    return (
        <ViewerLivestream/>
    )
}