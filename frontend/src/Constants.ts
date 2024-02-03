import { Dimensions, Platform } from 'react-native'
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'
import { DefaultTheme } from 'react-native-paper';

export const THEME_COLOUR: string = '#3AB0FF';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: '#000000',
        primary: '#560CCE',
        secondary: '#414757',
        error: '#f13a59',
    },
}

export const CONTENT_SPACING = 15

const SAFE_BOTTOM =
    Platform.select({
        ios: 34,
    }) ?? 0

export const SAFE_AREA_PADDING = {
    paddingLeft: 44 + CONTENT_SPACING,
    paddingTop: 44 + CONTENT_SPACING,
    paddingRight: 44 + CONTENT_SPACING,
    paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
}

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 10

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Platform.select<number>({
    android: Dimensions.get('screen').height - 34,
    ios: Dimensions.get('window').height,
}) as number

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78

// Control Button like Flash
export const CONTROL_BUTTON_SIZE = 40