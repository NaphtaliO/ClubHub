import { Video, VideoProps } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React from 'react';
import { ImageBackgroundComponent, ImageBackgroundProps, ImageComponent, ImageProps } from 'react-native';
interface CachedMediaURISource {
    uri: string;
    headers?: {
        [key: string]: string;
    };
    expiresIn?: number;
}
export interface CachedMediaProps {
    source: CachedMediaURISource;
    cacheKey?: string;
    placeholderContent?: ({ totalBytesWritten, totalBytesExpectedToWrite, }: FileSystem.DownloadProgressData) => React.ReactElement;
    children?: React.ReactNode;
    rest?: {
        [key: string]: any;
    };
}
export declare const MEDIA_CACHE_FOLDER: string;
/** @returns Number between 0 and 100, optionally with decimal to the specified decimalPlace */
export declare const getProgressPercent: (totalBytesWritten: number, totalBytesExpectedToWrite: number, decimalPlace?: number) => number;
/** @returns Number between 0 and 1, to the specified decimalPlace */
export declare const getProgress: (totalBytesWritten: number, totalBytesExpectedToWrite: number, decimalPlace?: number) => number;
export declare const getFileNameFromUri: (uri: string) => string;
declare const CacheManager: {
    addToCacheAsync: ({ file, key, }: {
        file: string;
        key: string;
    }) => Promise<string>;
    getCachedUriAsync: ({ key }: {
        key: string;
    }) => Promise<string>;
    downloadAsync: ({ uri, key, options, }: {
        uri: string;
        key: string;
        options: FileSystem.DownloadOptions;
    }) => Promise<FileSystem.FileSystemDownloadResult>;
};
declare const CachedImage: React.ForwardRefExoticComponent<(CachedMediaProps & (ImageProps | ImageBackgroundProps | VideoProps)) & React.RefAttributes<ImageComponent | ImageBackgroundComponent>>;
declare const CachedVideo: React.ForwardRefExoticComponent<(CachedMediaProps & (ImageProps | ImageBackgroundProps | VideoProps)) & React.RefAttributes<typeof Video>>;
export { CacheManager, CachedImage, CachedVideo };
//# sourceMappingURL=index.d.ts.map