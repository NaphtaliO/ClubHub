import { StyleSheet, ImageBackground, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Prop = {
  image: string
  removeImage: () => void
}

export default function ImageViewer({ image, removeImage }: Prop) {

  return (
    <View>
      <ImageBackground source={{ uri: image }} style={styles.image} >
        <TouchableOpacity style={styles.closeButton} onPress={removeImage}>
          <Ionicons name="close-circle" size={40} color="white" />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 500,
    resizeMode: "contain",
  },
  closeButton: {
    marginLeft: 'auto',
    top: 0,
    right: 0
  }
});
