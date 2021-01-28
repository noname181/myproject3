import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const MyMapView = (props) => {
    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={props.region}
            // showsUserLocation={true}
            onRegionChange={(reg) => props.onRegionChange(reg)}>

            <Marker coordinate={props.region} image={require('../../assets/images/marker.png')} />
        </MapView>
    )
}
export default MyMapView;