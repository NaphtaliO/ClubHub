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


export default function WatchLiveStream({ route }: WatchLiveStreamProps) {
    const { event } = route.params;
    console.log(event);
    
    const authUser = useAppSelector((state) => state.user.value);

    const apiKey = "mmhfdzb5evj2";
    // const token = `${user?.token}`;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTHVrZV9Ta3l3YWxrZXIiLCJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0x1a2VfU2t5d2Fsa2VyIiwiaWF0IjoxNzA5MTE5MzQ0LCJleHAiOjE3MDk3MjQxNDl9.XTKJj0LvApLFigjZC4QB2cKvfpn86NdE6qx-uFCZdmQ"
    const userId = "Luke_Skywalker";
    const callId = event._id;
    const name = authUser?.name

    // Initialize the user object. The user can be anonymous, guest, or authenticated
    // const liveStreamUser = {
    //     id: `${user?._id}`,
    //     name:`${user?.name}`,
    //     image: `${user?.avatar}`,
    //     type: 'authenticated'
    // };

    const user: User = {
        // any string can be used for the id
        id: userId,
        // name and image are used in the UI
        name: 'Santhosh',
        image: `https://getstream.io/random_png/?id=${userId}&name=Santhosh`,
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