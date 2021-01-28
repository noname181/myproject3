import React, { useEffect, useState } from 'react';
import { View, Dimensions, TouchableHighlight, Platform, StatusBar } from 'react-native';
import MapInput from '../components/GoogleAutocomplete/MapInput';
import MyMapView from '../components/GoogleAutocomplete/MapView';
import { getLocation, geocodeLocationByName } from '../services/location-service';
import MyStatusBar from '../components/MyStatusBar';
import Geocoder from 'react-native-geocoding';

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

function MapContainer() {
    const [region, setRegion] = useState({});
    const [typing, setTyping] = useState(false);
    const [selection, setSelection] = useState(null);
    const [address, setAddress] = useState("");

    useEffect(() => {
        getInitialState();
        Geocoder.init("AIzaSyB12tR2B1s4TGPG5zwoJ-w1MEH3gh-FLuU", { language: "vi" });

        return () => {
        };
    }, []);


    function getInitialState() {
        getLocation().then(
            (data) => {
                console.log(data);
                setRegion({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003
                });
            }
        );
    }

    function getCoordsFromName(loc) {
        setTyping(false);
        setRegion({
            latitude: loc.lat,
            longitude: loc.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
        });
    }

    function onMapRegionChange(region) {
        // console.log(region);
        Geocoder.from(region.latitude, region.longitude)
            .then(json => {
                let address = json.results[0].formatted_address;
                let geometry = json.results[0].geometry.location;
                // setCenterLocation({ latitude: geometry.lat, longitude: geometry.lng })
                // setSearch(address);
                console.log(address);
            })
            .catch(error => console.warn(error));
    }

    function focus() {
        setTyping(true);
        setSelection(null);
        console.log(typing);
    }

    return (
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
                    selection={selection}
                    onRegionChange={onMapRegionChange}
                />
            </TouchableHighlight>

            {
                region['latitude'] && !typing ?
                    <View style={{ position: 'absolute', height: height, width: width, top: Platform.OS == 'android' ? StatusBar.currentHeight + 30 : 60, left: 0, zIndex: 2, elevation: 2 }}>
                        <MyMapView
                            region={region}
                            onRegionChange={(reg) => onMapRegionChange(reg)} />
                        {/* <View style={{ height: 20, width: 20, borderRadius: 25, backgroundColor: 'blue', position: 'absolute', top: '49%', right: '48%' }}></View> */}
                    </View>
                    : null
            }
        </View>
    );

}

export default MapContainer;