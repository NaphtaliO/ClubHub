import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { theme } from '../Constants';
import {ReactNode} from 'react'

type ButtonProp = {
  type: string,
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal" | undefined
  style?: false | object | undefined,
  onPress: () => void,
  children: ReactNode
}

export default function Button({ type, mode, style, ...props }: ButtonProp & ButtonProps) {
  
  // if (theme === "primary") {
  //   return (
  //     <View
  //       style={[
  //         styles.buttonContainer,
  //         { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
  //       ]}>
  //       <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={onPress}>
  //         <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
  //         <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
  //       </Pressable>
  //     </View>
  //   );
  // } else if (theme === "close-button") {
  //   return (
  //     <View
  //       style={[
  //         styles.buttonContainer,
  //         { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
  //       ]}>
  //       <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={onPress}>
  //         <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
  //         <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
  //       </Pressable>
  //     </View>
  //   );
  // } else 
  if (type === "auth") {
    return (
      <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
    ) 
  }
}

const styles = StyleSheet.create({
  // buttonContainer: {
  //   width: 320,
  //   height: 68,
  //   marginHorizontal: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: 3,
  // },
  // button: {
  //   borderRadius: 10,
  //   width: '100%',
  //   height: '100%',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   flexDirection: 'row',
  // },
  // buttonLabel: {
  //   color: '#fff',
  //   fontSize: 16,
  // },
  // buttonIcon: {
  //   paddingRight: 8,
  // },
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});