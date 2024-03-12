"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProgressPercent = exports.getProgress = exports.getFileNameFromUri = exports.MEDIA_CACHE_FOLDER = exports.CachedVideo = exports.CachedImage = exports.CacheManager = void 0;
var _expoAv = require("expo-av");
var FileSystem = _interopRequireWildcard(require("expo-file-system"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MEDIA_CACHE_FOLDER = `${FileSystem === null || FileSystem === void 0 ? void 0 : FileSystem.cacheDirectory}`;
// export const MEDIA_DOCUMENT_FOLDER = `${FileSystem.documentDirectory}media/`

// const Image = lazy(() => import('./suspense/Image'))
// const ImageBackground = lazy(() => import('./suspense/ImageBackground'))
// const Video = lazy(() => import('./suspense/Video'))

/** @returns Number between 0 and 100, optionally with decimal to the specified decimalPlace */
exports.MEDIA_CACHE_FOLDER = MEDIA_CACHE_FOLDER;
const getProgressPercent = function (totalBytesWritten, totalBytesExpectedToWrite) {
  let decimalPlace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const rawPercentage = totalBytesWritten / totalBytesExpectedToWrite * 100;
  return Number(rawPercentage === null || rawPercentage === void 0 ? void 0 : rawPercentage.toFixed(decimalPlace));
};

/** @returns Number between 0 and 1, to the specified decimalPlace */
exports.getProgressPercent = getProgressPercent;
const getProgress = function (totalBytesWritten, totalBytesExpectedToWrite) {
  let decimalPlace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
  const rawProgress = totalBytesWritten / totalBytesExpectedToWrite;
  return Number(rawProgress === null || rawProgress === void 0 ? void 0 : rawProgress.toFixed(decimalPlace));
};
exports.getProgress = getProgress;
const getFileNameFromUri = uri => {
  return uri.substring(uri.lastIndexOf('/') + 1).split('?')[0].split('#')[0];
};
exports.getFileNameFromUri = getFileNameFromUri;
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
exports.CacheManager = CacheManager;
function createCachedMediaElement(name) {
  const CachedMediaElement = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
    const progress = (0, _react.useRef)({
      totalBytesWritten: 0,
      totalBytesExpectedToWrite: 1000
    });
    const [{
      totalBytesWritten,
      totalBytesExpectedToWrite
    }, updateProgress] = (0, _react.useState)(progress.current);
    const {
      source,
      cacheKey = getFileNameFromUri(source.uri),
      placeholderContent = () => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
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
    const [mediaUri, setMediaUri] = (0, _react.useState)(fileUri);
    const componentIsMounted = (0, _react.useRef)(true);
    const requestOption = headers ? {
      headers
    } : {};
    const downloadResumableRef = (0, _react.useRef)(FileSystem.createDownloadResumable(uri, fileUri, requestOption, _callback));
    (0, _react.useEffect)(() => {
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
      return /*#__PURE__*/_react.default.createElement(_expoAv.Video, _extends({}, props, {
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
      return /*#__PURE__*/_react.default.createElement(_reactNative.ImageBackground, _extends({}, props, {
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
    return /*#__PURE__*/_react.default.createElement(_reactNative.Image, _extends({}, props, {
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
exports.CachedImage = CachedImage;
const CachedVideo = createCachedMediaElement('CachedVideo');
exports.CachedVideo = CachedVideo;
const styles = _reactNative.StyleSheet.create({
  flexFill: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
//# sourceMappingURL=index.js.map