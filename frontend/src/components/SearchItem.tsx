import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';
import CustomImage from './CustomImage';
import { useAppSelector } from '../hooks/hooks';

const SearchItem = ({ navigation, item }) => {
    const user = useAppSelector((state) => state.user.value)

    return (
            <TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 10,
                // marginHorizontal: 5
            }}>
                    <View>
                        {item.avatar === null || item.avatar === "" ?
                            <Image style={styles.image} source={require('../assets/default_avatar.png')} /> :
                            <CustomImage style={styles.image} uri={item.avatar} />}
                    </View>
                    <View style={{ justifyContent: 'center', paddingLeft: 7 }}>
                        <Text style={{ fontWeight: '500', fontSize: 16.5 }}>{item.name}</Text>
                    {/* <Text style={{ color: "#606470", }}>{item.username}</Text> */}
                    {/* TODO: Instead commented out text show how many members the club has */}
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