import React, { useEffect, useState, useRef, useContext } from 'react'
import { Text, StyleSheet, Platform, View, Image, Dimensions, TextInput, ImageBackground, StatusBar } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'
import Header from '../components/Header'
import Geolocation from '@react-native-community/geolocation'
import { request, PERMISSIONS } from 'react-native-permissions'
import Carousel from 'react-native-snap-carousel'
import Polyline from '@mapbox/polyline'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geocoder from 'react-native-geocoding'
import MyStatusBar from '../components/MyStatusBar'
import { connect } from 'react-redux'
import AuthContext from '../hooks/AuthContext'
import { useIsFocused } from '@react-navigation/native';

function Map(props) {
    Geocoder.init("AIzaSyB12tR2B1s4TGPG5zwoJ-w1MEH3gh-FLuU", { language: "vi" })
    const map = useRef()
    const markers = useRef([])
    const carousel = useRef()
    const [distance, setDistance] = useState()
    const [address, setAddress] = useState()
    const [coords, setCoords] = useState()
    const [status, setStatus] = useState(false)

    const [currentLocation, setCurrentLocation] = useState({
        latitude: props.currentLocation.lat,
        longitude: props.currentLocation.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const authContext = useContext(AuthContext);

    const isFocused = useIsFocused();

    useEffect(() => {
        // requestLocationPermission()
        return () => {
        }
    }, [])

    // requestLocationPermission = async () => {
    //     if (Platform.OS === 'ios') {
    //         var respone = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    //         if (respone === 'granted')
    //             locateCurrentPosition()
    //     } else {
    //         var respone = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    //         if (respone === 'granted')
    //             locateCurrentPosition()
    //     }
    // }

    // function locateCurrentPosition() {
    //     Geolocation.getCurrentPosition(
    //         position => {
    //             map.current.animateToRegion({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //                 latitudeDelta: 0.0922,
    //                 longitudeDelta: 0.0421,
    //             }, 1500)
    //             setCurrentLocation({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //                 latitudeDelta: 0.0922,
    //                 longitudeDelta: 0.0421,
    //             })

    //         },
    //         error => {
    //             console.log(error)
    //         }
    //     )
    // }

    function onRegionChange(region) {

    }
    function renderCarouselItem(item) {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.item.name}</Text>
                <Image source={{ uri: item.item.banner }} style={styles.itemImage}></Image>
            </View>
        )
    }
    function onCarouselItemChange(index) {
        let store = favouriteList[index]
        map.current.animateToRegion({
            latitude: Number(store.coordinate.lat),
            longitude: Number(store.coordinate.lng),
            latitudeDelta: 0.0522,
            longitudeDelta: 0.03221,
        }, 1000)
        // markers.current[index].showCallout()
        let start = currentLocation.latitude + "," + currentLocation.longitude
        let end = store.coordinate.lat + "," + store.coordinate.lng
        getDirections(start, end)
        // mergeLot()
    }
    function onMarkerPress(marker, index) {
        // map.current.animateToRegion({
        //     latitude: marker.coordinate.lat,
        //     longitude: marker.coordinate.lng,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        // })
        carousel.current.snapToItem(index)
    }
    const getDirections = async function (startLoc, destinationLoc) {

        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destinationLoc}&key=AIzaSyB12tR2B1s4TGPG5zwoJ-w1MEH3gh-FLuU`)
            let respJson = await resp.json()
            setDistance(respJson.routes[0].legs[0].distance.text)
            setAddress(respJson.routes[0].legs[0].end_address)
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points)
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            setCoords(coords)
            setStatus(true)
            return coords
        } catch (error) {
            setStatus(false)
            console.log(error)
            return error
        }
    }
    function onSearch() {
        Geocoder.from(search)
            .then(json => {
                var location = json.results[0].geometry.location
                let start = currentLocation.latitude + "," + currentLocation.longitude
                let end = location.lat + "," + location.lng
                getDirections(start, end)
            })
            .catch(error => console.warn(error))
    }

    useEffect(() => {

        favouriteList.length > 0 ? getDirections(null, `${favouriteList[0].coordinate.lat},${favouriteList[0].coordinate.lng}`) : setStatus(false)
    }, [props.stores, props.currentLocation, favouriteList, isFocused])
    console.log(props.currentLocation)

    const favouriteList = authContext.user ? props.stores.filter((value, index) => {
        return authContext.user.favouriteRestaurent?.includes(value._id)
    }) : []


    return (
        <>

            <View style={{ zIndex: 1 }}>
                <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                {address && distance && status && <Text style={styles.info}>{address + '\n Khoảng cách: ' + distance}</Text>}
                {/* <Header style={{ borderBottomWidth: 0 }}>DETAILS</Header> */}
                {/* <View style={styles.myInput}>
                    <TextInput numberOfLines={1} style={styles.input} placeholder="Tìm kiếm địa chỉ..." value={search} placeholderTextColor='gray' onChangeText={value => setSearch(value)} selection={{ start: 0 }} autoCorrect={false} />
                    <Ionicons style={styles.inputIcon} name="md-search" color='gray' size={20}
                        onPress={onSearch}
                    ></Ionicons>
                </View> */}
            </View>

            <View style={styles.container}>

                <MapView
                    ref={map}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={currentLocation}
                // onRegionChangeComplete={(region) => {
                //     Geocoder.from(region.latitude, region.longitude)
                //         .then(json => {
                //             let address = json.results[0].formatted_address
                //             let geometry = json.results[0].geometry.location
                //             setCenterLocation({ latitude: geometry.lat, longitude: geometry.lng })
                //             setSearch(address)
                //             // console.log(addressComponent)
                //         })
                //         .catch(error => console.warn(error))
                // }}
                >
                    {
                        currentLocation && (
                            <Marker
                                coordinate={currentLocation}
                            // icon={require('../assets/images/home-marker.png')}

                            >
                                <View style={{ height: 50, width: 50, backgroundColor: 'transparent' }} >
                                    <Image resizeMode={'contain'} source={{ uri: 'https://cdn.pixabay.com/photo/2013/07/12/17/00/location-151669_1280.png' }} style={{ height: 50, width: 50 }} />

                                </View>
                            </Marker>
                        )
                    }
                    {favouriteList.length > 0 ? favouriteList.map((marker, index) => (
                        <Marker
                            onPress={() => onMarkerPress(marker, index)}
                            ref={ele => { markers.current[index] = ele }}
                            key={marker.name}
                            coordinate={{
                                latitude: Number(marker.coordinate.lat),
                                longitude: Number(marker.coordinate.lng)
                            }}
                        // icon={require('../assets/images/marker.png')}
                        >
                            <ImageBackground resizeMode={'cover'} style={{ height: 50, width: 50, backgroundColor: 'transparent', borderRadius: 30, overflow: 'hidden' }} source={{ uri: marker.banner }}>
                                {/* <Image resizeMode={'contain'} source={require('../assets/images/marker.png')} style={{ height: 50, width: 50 }} /> */}

                            </ImageBackground>
                            {/* <Callout>
                                <Text>{marker.name}</Text>
                            </Callout> */}
                        </Marker>
                    )) : null}

                    {status ? <MapView.Polyline
                        coordinates={coords}
                        strokeWidth={4}
                        strokeColor="#f74f2d" /> : null

                    }
                </MapView>

                <Carousel
                    ref={carousel}
                    data={favouriteList}
                    containerCustomStyle={styles.carousel}
                    renderItem={renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    onSnapToItem={item => onCarouselItemChange(item)}
                    loop={true}
                />
            </View>
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        currentLocation: state.currentLocation,
        stores: state.stores
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
        marginTop: StatusBar.currentHeight ? StatusBar.currentHeight : 20
    },
    container: {
        ...StyleSheet.absoluteFillObject
    },
    carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 20,
    },
    itemImage: {
        height: 150,
        width: 300,
        position: 'absolute',
        bottom: 0,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    itemTitle: {
        color: "#fff",
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: "bold"
    },
    itemContainer: {
        height: 200,
        width: 300,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 10,
        borderRadius: 20,
    },
    info: {
        position: 'relative',
        top: 0,
        textAlign: 'center',
        alignSelf: 'center',
        padding: 10,
        marginBottom: 10,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.4)',
        left: 0,
        right: 0,
        width: '100%'
    },
    myInput: {
        width: '100%',
        height: 45,
        top: 20,
        paddingHorizontal: 20,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'relative',
        marginHorizontal: '5%',
        zIndex: 1
    },
    input: {
        height: 40,
        color: '#000',
        height: '100%',
        paddingRight: 30
    },
    inputIcon: {
        position: 'absolute',
        right: 20,
        top: 10,
        zIndex: 1
    }
})


