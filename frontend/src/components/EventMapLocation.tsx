import { StyleSheet, Text, View, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

type Prop = {
    location: string
}

type CoordinateProp = {
    latitude: number,
    longitude: number
}

const EventMapLocation = ({ location }: Prop) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<CoordinateProp>({
        latitude: 51.8931885, longitude: -8.4936477
    })

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const geocode = await Location.geocodeAsync(location);
                // console.log(geocode)

                if (geocode && geocode.length > 0) {
                    const { latitude, longitude } = geocode[0];
                    setCoordinates({ latitude, longitude });
                } else {
                    // Alert.alert('Location not found', 'Please enter a valid location.');
                }
            } catch (error) {
                console.log(error);
            }


            // setLocation(location);
        })();
    }, [location, coordinates]);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View>
            <MapView style={styles.map}
                initialRegion={{
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0,
                }}>
                <Marker
                    coordinate={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                    }}
                    title="Location"
                    description="Selected location"
                />
            </MapView>
        </View>
    )
}

export default EventMapLocation

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 150,
    },
})