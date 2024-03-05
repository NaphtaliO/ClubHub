import React from 'react';
// import { ResizeMode, Video } from 'expo-av';
import { View } from 'react-native';

type Prop = {
    style: object
    uri: string
}

const CustomVideo = ({ style, uri }: Prop) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        // <Video
        //     ref={video}
        //     style={style}
        //     source={{ uri: uri }}
        //     useNativeControls
        //     resizeMode={ResizeMode.CONTAIN}
        //     isLooping
        //     onPlaybackStatusUpdate={status => setStatus(() => status)}
        // />
        <View>

        </View>
    )
}

export default CustomVideo;