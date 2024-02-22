import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react';
import CustomImage from './CustomImage';

const SearchItem = ({ navigation, item }) => {

    return (
        <TouchableOpacity onPress={() => {
            navigation.push('ClubProfile', { name: item.name, id: item._id })
        }}>
            <View style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 10
            }}>
                <View>
                    {item.avatar === null || item.avatar === "" ?
                        <Image style={styles.image} source={require('../assets/default_avatar.png')} /> :
                        <CustomImage style={styles.image} uri={item.avatar} />}
                </View>
                <View style={{ justifyContent: 'center', paddingLeft: 7 }}>
                    <Text style={{ fontWeight: '500', fontSize: 16.5 }}>{item.name}</Text>
                    <Text style={{ color: "#606470" }}>{item.members.length} members</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SearchItem;

const styles = StyleSheet.create({
    image: {
        width: 65,
        height: 65,
        borderRadius: 50
    }
})