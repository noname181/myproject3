import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, TouchableHighlight, Platform, StatusBar, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import MapInput from '../components/GoogleAutocomplete/MapInput';
import MyMapView from '../components/GoogleAutocomplete/MapView';
import { getLocation, geocodeLocationByName } from '../services/location-service';
import MyStatusBar from '../components/MyStatusBar';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux'

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

function MapContainer(props) {
    const [region, setRegion] = useState({});
    const [typing, setTyping] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [address, setAddress] = useState("");
    const map = useRef()

    useEffect(() => {
        Geocoder.init("AIzaSyB12tR2B1s4TGPG5zwoJ-w1MEH3gh-FLuU", { language: "us" });

        return () => {
        };
    }, []);

    function getCoordsFromName(loc) {
        setTyping(false);
        let region = {
            latitude: loc.lat,
            longitude: loc.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
        }
        setRegion(region);
        map.current.animateToRegion(region, 1000)
        Geocoder.from(loc.lat, loc.lng)
            .then(json => {
                let address = json.results[0].formatted_address;
                let geometry = json.results[0].geometry.location;
                // setCenterLocation({ latitude: geometry.lat, longitude: geometry.lng })
                setAddress(address);
            })
            .catch(error => console.warn(error));
    }

    function onMapRegionChange(region) {
        // console.log(region);
        Geocoder.from(region.latitude, region.longitude)
            .then(json => {
                let address = json.results[0].formatted_address;
                let geometry = json.results[0].geometry.location;
                // setCenterLocation({ latitude: geometry.lat, longitude: geometry.lng })
                setAddress(address);
            })
            .catch(error => console.warn(error));
    }

    const onChangeValue = (e) => {
        setAddress(e.nativeEvent.text)
    }

    function focus() {
        setTyping(true);
        setSelection(null);
    }

    return (
        props.location ?
            <View style={{ flex: 1 }}>
                <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                <TouchableHighlight style={{ position: 'absolute', top: Platform.OS == 'android' ? StatusBar.currentHeight : 20, left: 0, width: '100%', zIndex: 3, elevation: 3, backgroundColor: 'white' }}>
                    <MapInput
                        notifyChange={(loc) => getCoordsFromName(loc)}
                        focus={focus}
                        blur={() => {
                            setTyping(false);
                            setSelection({ start: 0, end: 0 });
                        }}
                        onRegionChange={onMapRegionChange}
                        selection={selection}
                        value={address}
                        changeValue={onChangeValue}
                    />

                </TouchableHighlight>

                {
                    props.location && !typing ?
                        <View style={{ position: 'absolute', height: height - 40, width: width, top: Platform.OS == 'android' ? StatusBar.currentHeight + 40 : 60, left: 0, zIndex: 2, elevation: 2 }}>
                            <MapView
                                style={{ flex: 1 }}
                                initialRegion={{
                                    latitude: props.location.lat,
                                    longitude: props.location.lng,
                                    latitudeDelta: 0.003,
                                    longitudeDelta: 0.003
                                }}
                                // showsUserLocation={true}
                                // showsMyLocationButton={true}
                                onRegionChangeComplete={(reg) => onMapRegionChange(reg)}
                                ref={map}
                            >

                                {/* <Marker coordinate={props.region} image={require('../../assets/images/marker.png')} /> */}
                            </MapView>

                            <Image resizeMode={'contain'} source={require('../assets/images/marker.png')} style={{ height: 40, width: 40, borderRadius: 25, position: 'absolute', top: (height - 120) / 2, right: (width - 40) / 2 }}></Image>

                        </View>
                        : null
                }
                <TouchableOpacity style={styles.cartBar} >
                    <Text style={styles.cartText}>UPDATE ADDRESS</Text>
                </TouchableOpacity>
            </View> :
            <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                <ActivityIndicator size="large" color="#f75f2d" />
            </Screen>
    );

}

const styles = StyleSheet.create({
    cartText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    cartBar: {
        width: width - 30,
        borderRadius: 5,
        height: 45,
        backgroundColor: '#f75f2d',
        marginHorizontal: 15,
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        elevation: 3,
        zIndex: 3
    }
})

const mapStateToProps = (state) => {
    return {
        location: state.currentLocation,
        address: state.currentAddress
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
