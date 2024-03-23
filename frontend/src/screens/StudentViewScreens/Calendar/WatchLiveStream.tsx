import React, { useCallback, useEffect } from "react";
import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    StreamVideoEvent,
    User,
    ViewerLivestream,
    useCall,
    useCallStateHooks,
    useIncallManager,
} from "@stream-io/video-react-native-sdk";
import { SafeAreaView, Platform, PermissionsAndroid, View, Text, ActivityIndicator } from "react-native";
import { useAppSelector } from "../../../hooks/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { Event, WatchLiveStreamProps } from "../../../types/types";
import { socket } from "../../../socket";
import { LIVESTREAMAPIKEY } from "@env";


export default function WatchLiveStream({ route, navigation }: WatchLiveStreamProps) {
    const { event } = route.params;
    const authUser = useAppSelector((state) => state.user.value);

    const apiKey = LIVESTREAMAPIKEY;
    const token = `${authUser?.token}`;
    const callId = `${event._id}`;

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

    // const unsubscribe = myClient.on('all', (event: StreamVideoEvent) => {
    //     if (event.type === 'call.ended') {
    //         console.log(`Call ended: ${event.call_cid}`);
    //     }
    // });

    // // Unsubscribe
    // unsubscribe();



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
                    <WatchLiveStreamUI event={event} navigation={navigation} />
                </SafeAreaView>
            </StreamCall>
        </StreamVideo>
    );
}

const WatchLiveStreamUI = ({ event, navigation }: { event: Event }) => {
    const { useCallIngress, useIsCallLive } = useCallStateHooks();

    const ingress = useCallIngress();
    const rtmpURL = ingress?.rtmp.address;
    // const streamKey = token;
    const isCallLive = useIsCallLive();

    // useEffect(() => {
    //     const timerId = setTimeout(() => {
    //         if (!isCallLive) {
    //             navigation.goBack();
    //             alert("This event is not live.")
    //         }
    //     }, 2000);

    //     // Clear the timer if the component unmounts before the delay completes
    //     return () => clearTimeout(timerId);
    // }, [isCallLive])

    // if(!isCallLive){
    //     <View style={{ flex: 1, justifyContent: 'center' }}>
    //         <ActivityIndicator size={30} color={'black'} />
    //     </View>
    // }

    // if (isCallLive) {
    //     return (
    //         <ViewerLivestream />
    //     )
    // }
    return (
        <ViewerLivestream />
    )
}