import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { unique } from '../Functions';
import { useFocusEffect } from '@react-navigation/native';

type Prop = {
    style: object,
    uri: string,
    status: any,
    setStatus: any,
    onVideoRef: (video: RefObject<Video>) => void,
}

type SourceProp = {
    uri: string
}

const CustomVideo = ({ style, uri, status, setStatus, onVideoRef }: Prop) => {
    const [source, setSource] = useState<SourceProp>({ uri: '' });
    const video = useRef<Video>(null);

    useEffect(() => {
        if (onVideoRef && typeof onVideoRef === 'function') {
            onVideoRef(video);
        }
    }, [onVideoRef, video]);

    useFocusEffect(
        useCallback(() => {

            return () => {
                video.current?.pauseAsync();
            };
        }, [video])
    );

    useEffect(() => {
        const cache = async () => {
            try {
                const name: string = unique(uri);
                const path = `${FileSystem.documentDirectory}${name}.mp4`;
                
                const image = await FileSystem.getInfoAsync(path);

                if (image.exists) {
                    // console.log('read image from cache');
                    setSource({ uri: image.uri })
                    return;
                }

                // console.log('downloading image to cache');
                const downloadResumable = FileSystem.createDownloadResumable(
                    uri,
                    path,
                    {},
                    downloadProgress => {
                        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                        // console.log(progress);
                    }
                );

                const newImage = await downloadResumable.downloadAsync();
                setSource({ uri: `${newImage?.uri}` });
                
            } catch (error) {
                console.log(error);
            }
        }
        cache();
    }, [])

    return (
        <Video
            ref={video}
            style={style}
            source={{ uri: source?.uri }}
            shouldPlay={false}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
            onError={(error) => console.log(error)}
        />
    )
}

export default CustomVideo;