import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, ScrollView, FlatList, Text, Image, ImageBackground, PanResponder, Platform, Dimensions, ActivityIndicator, StatusBar, SectionList, TouchableOpacity } from 'react-native'
import { Screen, Header, FoodItemVertical, MyStatusBar, HeaderStore } from '../components'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'

let topDirection = Platform.OS == 'android' ? StatusBar.currentHeight : 20
let foodListHeight = Dimensions.get('window').height
let sectionOffScroll = false
const width = Dimensions.get('window').width

function Store(props) {
    const [selectedItem, setSelectedItem] = useState(1)
    const [store, setStore] = useState({})
    const [foods, setFoods] = useState([])
    const [load, setLoad] = useState(false)
    const [distance, setDistance] = useState(0)
    const menu = useRef()
    const section = useRef()

    const opacityHeaderMenu = useSharedValue(0)
    const opacityBanner = useSharedValue(1)
    const heighBanner = useSharedValue(250)

    const opacityHeaderMenuStyles = useAnimatedStyle(() => {
        return {
            opacity: opacityHeaderMenu.value
        };
    });
    const BannerStyles = useAnimatedStyle(() => {
        return {
            opacity: opacityBanner.value,
            height: heighBanner.value
        };
    });

    let amount = 0, total = 0

    const getStoreInfo = async () => {
        try {
            let [store, foods] = await Promise.all([axios.get('https://restfull-api-nodejs-mongodb.herokuapp.com/stores/' + props.route.params.id), axios.get('https://restfull-api-nodejs-mongodb.herokuapp.com/foods/store/' + props.route.params.id)])
            setStore(store.data)
            let tempFood = []
            store.data.categories.map((value1, index1) => {
                let foodsCate = foods.data.filter((value2, index2) => {
                    return value2.categories.includes(value1)
                })
                if (foodsCate.length > 0)
                    tempFood.push({ title: value1, data: foodsCate, key: index1 })
            })
            setFoods(tempFood)
            setLoad(true)
            getDirections(null, `${store.data.coordinate.lat},${store.data.coordinate.lng}`)
        } catch (err) {
            setLoad(true)
        }

    }

    useEffect(() => {
        getStoreInfo();
        return () => { }

    }, [])

    const _onViewableItemsChanged = ({ viewableItems, changed }) => {
        let length = viewableItems.length

        if (!sectionOffScroll && viewableItems[length - 1]) {
            setSelectedItem(viewableItems[length - 1] ? viewableItems[length - 1].section.key + 1 : viewableItems[length - 2].section.key + 1)
            menu.current.scrollToIndex({
                animated: true,
                index: viewableItems[length - 1] ? viewableItems[length - 1].section.key : viewableItems[length - 2].section.key,
                viewPosition: 0.5
            })
        }
        // console.log("Visible items :", viewableItems[length - 1].section.key)
    }

    const _renderMenu = ({ item, index }) =>
        <TouchableOpacity
            style={selectedItem === index + 1 ? [styles.item, styles.active] : styles.item}
            onPress={() => {

                sectionOffScroll = true
                setSelectedItem(index + 1)
                menu.current.scrollToIndex({ animated: true, index: index, viewPosition: 0.5 })
                section.current.scrollToLocation({
                    animated: true,
                    itemIndex: 0,
                    sectionIndex: index,
                    viewPosition: 0
                })
                setTimeout(() => {
                    sectionOffScroll = false
                }, 600)

            }}
        >
            <Text style={selectedItem === index + 1 ? [styles.textMenu, { color: '#f75f2d' }] : styles.textMenu}>{item}</Text>
        </TouchableOpacity>

    const _renderSectionFoods = ({ item }) =>
        <FoodItemVertical
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            description={item.description}
            type={"product"}
        />

    const onScrollSectionFoods = (e) => {
        let currentY = e.nativeEvent.contentOffset.y
        if (currentY < 108) {
            opacityHeaderMenu.value = currentY / 108
            opacityBanner.value = (108 - currentY) / 108
        } else {
            opacityHeaderMenu.value = 1
            opacityBanner.value = 0
        }
    }

    const getDirections = async function (startLoc, destinationLoc) {

        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=10.824922104301836,106.68002408383542&destination=${destinationLoc}&key=AIzaSyB12tR2B1s4TGPG5zwoJ-w1MEH3gh-FLuU`)
            let respJson = await resp.json()
            setDistance(respJson.routes[0].legs[0].distance.text)
            return coords
        } catch (error) {
            return error
        }
    }


    props.cart.map(value => {
        amount += value.amount
        total += value.total
    })


    return (
        load ?
            <>
                <Screen style={styles.container}>
                    <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />

                    <Animated.View style={[{ zIndex: 6, backgroundColor: 'white', top: -20, paddingTop: 20 }, opacityHeaderMenuStyles]}>
                        <Header
                            style={{ borderBottomWidth: 0 }} styleIcon={{ backgroundColor: 'white' }}
                        >
                            {store.name}
                        </Header>
                        <FlatList
                            style={styles.listMenu}
                            data={store.categories}
                            ref={menu}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={_renderMenu}

                        />
                    </Animated.View>
                    <Animated.View style={[{ height: 250, position: 'absolute', width: '100%', zIndex: -10 }, BannerStyles]}>
                        <ImageBackground source={{ uri: store.banner }} style={styles.banner} ></ImageBackground>
                    </Animated.View>
                    <LinearGradient colors={['rgba(145, 145, 145,0.8)', 'rgba(145, 145, 145,0.4)', 'rgba(145, 145, 145,0)']} style={styles.direction}>
                        <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{
                            borderRadius: 50, position: 'relative', top: -3, right: 5
                        }} >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="heart-outline" size={22} color="white" style={{ marginRight: 15, position: 'relative', top: -3, right: 4 }} />
                            <Ionicons name="md-search" size={22} color="white" style={{ position: 'relative', top: -3, right: 4 }} />
                        </View>

                    </LinearGradient>
                    {
                        props.cart.length !== 0 ?
                            <View style={{ width: '100%', zIndex: 7, position: 'absolute', bottom: 0, paddingBottom: 15, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                                <TouchableOpacity style={styles.cartBar} onPress={() => props.navigation.navigate('Cart')}>
                                    <Text style={styles.cartText}>{amount} Món</Text>
                                    <Text style={styles.cartText}>Giỏ hàng</Text>
                                    <Text style={styles.cartText}>{(total.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.')).slice(0, -4)}đ</Text>
                                </TouchableOpacity>
                            </View> : null
                    }


                    <SectionList
                        ref={section}
                        style={styles.foodList}
                        sections={foods}
                        keyExtractor={(item, index) => index}
                        stickySectionHeadersEnabled={false}

                        renderItem={_renderSectionFoods}
                        onViewableItemsChanged={_onViewableItemsChanged}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 100 //means if 50% of the item is visible
                        }}
                        onEndReached={(data) => {

                        }}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.headerSection}>{title}</Text>
                        )}
                        onScroll={onScrollSectionFoods}
                        contentContainerStyle={props.cart.length !== 0 ? { paddingBottom: 60 } : { paddingBottom: 0 }}
                        ListHeaderComponent={
                            <HeaderStore store={store} distance={distance} />
                        }
                    // {...panResponder.panHandlers}
                    />

                </Screen>

            </> :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                <ActivityIndicator size="large" color="#f75f2d" />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    cartText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    cartBar: {
        width: width - 38,
        borderRadius: 5,
        height: 45,
        backgroundColor: '#f75f2d',
        marginHorizontal: 19,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    direction: {
        height: 55,
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 5,
        alignItems: 'center',
        top: topDirection,
    },
    textMenu: {
        fontWeight: 'bold',
        color: '#f75f2d',
        textTransform: "capitalize"
    },
    banner: {
        width: '100%',
        position: 'absolute',
        zIndex: 3,
        height: '100%',
        resizeMode: 'stretch'
    },
    foodList: {
        zIndex: 4,
        top: 60,
        height: foodListHeight - 170,
        overflow: 'visible',
        marginTop: -80,
        marginBottom: -60,
        flexGrow: 0,
    },
    listMenu: {
        paddingLeft: 20,
        overflow: 'visible',
        height: 40,
        backgroundColor: 'white',
    },
    item: {
        marginRight: 25,
        paddingVertical: 10,
        height: 40,
    },
    active: {
        borderBottomColor: '#f75f2d',
        borderBottomWidth: 3,
    },
    itemSection: {
        padding: 20,
        backgroundColor: 'white'
    },
    headerSection: {
        fontSize: 16,
        backgroundColor: "white",
        color: '#000',
        textTransform: 'capitalize',
        paddingLeft: 20,
        paddingVertical: 10,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    title: {
        fontSize: 14
    }

})
const mapStateToProps = (state) => {
    return {
        cart: state.cart
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Store)
