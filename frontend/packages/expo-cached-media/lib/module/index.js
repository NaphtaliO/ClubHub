function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useRef,
// Suspense,
forwardRef
// lazy,
} from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
export const MEDIA_CACHE_FOLDER = `${FileSystem === null || FileSystem === void 0 ? void 0 : FileSystem.cacheDirectory}`;
// export const MEDIA_DOCUMENT_FOLDER = `${FileSystem.documentDirectory}media/`

// const Image = lazy(() => import('./suspense/Image'))
// const ImageBackground = lazy(() => import('./suspense/ImageBackground'))
// const Video = lazy(() => import('./suspense/Video'))

/** @returns Number between 0 and 100, optionally with decimal to the specified decimalPlace */
export const getProgressPercent = function (totalBytesWritten, totalBytesExpectedToWrite) {
  let decimalPlace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const rawPercentage = totalBytesWritten / totalBytesExpectedToWrite * 100;
  return Number(rawPercentage === null || rawPercentage === void 0 ? void 0 : rawPercentage.toFixed(decimalPlace));
};

/** @returns Number between 0 and 1, to the specified decimalPlace */
export const getProgress = function (totalBytesWritten, totalBytesExpectedToWrite) {
  let decimalPlace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
  const rawProgress = totalBytesWritten / totalBytesExpectedToWrite;
  return Number(rawProgress === null || rawProgress === void 0 ? void 0 : rawProgress.toFixed(decimalPlace));
};
export const getFileNameFromUri = uri => {
  return uri.substring(uri.lastIndexOf('/') + 1).split('?')[0].split('#')[0];
};
const CacheManager = {
  addToCacheAsync: async _ref => {
    let {
      file,
      key = getFileNameFromUri(file)
    } = _ref;
    await FileSystem.copyAsync({
      from: file,
      to: `${MEDIA_CACHE_FOLDER}${key}`
    });
    // const uri = await FileSystem.getContentUriAsync(`${MEDIA_DOCUMENT_FOLDER}${key}`)

    const uri = await CacheManager.getCachedUriAsync({
      key
    });
    return uri;
  },
  getCachedUriAsync: async _ref2 => {
    let {
      key
    } = _ref2;
    const uri = await FileSystem.getContentUriAsync(`${MEDIA_CACHE_FOLDER}${key}`);
    return uri;
  },
  downloadAsync: async _ref3 => {
    let {
      uri,
      key = getFileNameFromUri(uri),
      options
    } = _ref3;
    return await FileSystem.downloadAsync(uri, `${MEDIA_CACHE_FOLDER}${key}`, options);
  }
};
function createCachedMediaElement(name) {
  const CachedMediaElement = /*#__PURE__*/forwardRef((props, ref) => {
    const progress = useRef({
      totalBytesWritten: 0,
      totalBytesExpectedToWrite: 1000
    });
    const [{
      totalBytesWritten,
      totalBytesExpectedToWrite
    }, updateProgress] = useState(progress.current);
    const {
      source,
      cacheKey = getFileNameFromUri(source.uri),
      placeholderContent = () => /*#__PURE__*/React.createElement(View, {
        style: styles.flexFill
      }),
      children,
      rest
    } = props;
    const {
      uri,
      headers,
      expiresIn
    } = source;
    const fileUri = `${MEDIA_CACHE_FOLDER}${cacheKey}`;
    const _callback = downloadProgress => {
      if (componentIsMounted.current === false) {
        downloadResumableRef.current.pauseAsync();
        FileSystem.deleteAsync(fileUri, {
          idempotent: true
        }); // delete file locally if it was not downloaded properly
      }

      progress.current = downloadProgress;
      updateProgress(progress.current);
    };
    const [mediaUri, setMediaUri] = useState(fileUri);
    const componentIsMounted = useRef(true);
    const requestOption = headers ? {
      headers
    } : {};
    const downloadResumableRef = useRef(FileSystem.createDownloadResumable(uri, fileUri, requestOption, _callback));
    useEffect(() => {
      loadMedia();
      return () => {
        componentIsMounted.current = false;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadMedia = async () => {
      try {
        // Use the cached media if it exists
        const metadata = await FileSystem.getInfoAsync(fileUri);
        const expired = expiresIn && 'modificationTime' in metadata && new Date().getTime() / 1000 - metadata.modificationTime > expiresIn;
        if (!metadata.exists || (metadata === null || metadata === void 0 ? void 0 : metadata.size) === 0 || expired) {
          if (componentIsMounted.current) {
            setMediaUri(null);
            if (expired) {
              await FileSystem.deleteAsync(fileUri, {
                idempotent: true
              });
            }
            // download to cache
            setMediaUri(null);
            const response = await downloadResumableRef.current.downloadAsync();
            if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
              setMediaUri(`${fileUri}?`); // deep clone to force re-render
            }

            if ((response === null || response === void 0 ? void 0 : response.status) !== 200) {
              FileSystem.deleteAsync(fileUri, {
                idempotent: true
              }); // delete file locally if it was not downloaded properly
            }
          }
        }
      } catch (err) {
        console.log({
          err
        });
      }
    };
    if (!mediaUri) return placeholderContent({
      totalBytesWritten,
      totalBytesExpectedToWrite
    }) || null;
    if (name === 'CachedVideo') {
      return /*#__PURE__*/React.createElement(Video, _extends({}, props, {
        source: {
          ...source,
          uri: mediaUri
        },
        style: [styles.flexFill, props === null || props === void 0 ? void 0 : props.style],
        videoStyle: [{
          width: '100%',
          height: '100%'
        }, rest === null || rest === void 0 ? void 0 : rest.videoStyle],
        ref: ref
      }));
    }
    if (name === 'CachedImage' && children) {
      return /*#__PURE__*/React.createElement(ImageBackground, _extends({}, props, {
        source: {
          ...source,
          uri: mediaUri
        },
        style: [styles.flexFill, props.style],
        imageStyle: [{
          width: '100%',
          height: '100%'
        }, rest === null || rest === void 0 ? void 0 : rest.imageStyle],
        ref: ref
      }), children);
    }
    return /*#__PURE__*/React.createElement(Image, _extends({}, props, {
      source: {
        ...source,
        uri: mediaUri
      },
      style: [styles.flexFill, rest === null || rest === void 0 ? void 0 : rest.style],
      ref: ref
    }));
  });
  CachedMediaElement.displayName = name;
  return CachedMediaElement;
}
const CachedImage = createCachedMediaElement('CachedImage');
const CachedVideo = createCachedMediaElement('CachedVideo');
export { CacheManager, CachedImage, CachedVideo };
const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
//# sourceMappingURL=index.js.map