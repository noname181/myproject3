import React, { useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';

const MyMapView = (props) => {
    const map = useRef()

    const animateToRegion = (location) => {
        map.current.animateToRegion({
            latitude: Number(location.lat),
            longitude: Number(location.lng),
            latitudeDelta: 0.0522,
            longitudeDelta: 0.03221,
        }, 1000)
    }

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={props.region}
            // showsUserLocation={true}
            // showsMyLocationButton={true}
            onRegionChangeComplete={(reg) => props.onRegionChange(reg)}
            ref={map}
        >

            {/* <Marker coordinate={props.region} image={require('../../assets/images/marker.png')} /> */}
        </MapView>
    )
}
export default MyMapView;