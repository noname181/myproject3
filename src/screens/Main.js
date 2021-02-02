import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions, Image, Button } from 'react-native'
import { Screen, Header, FoodItem, Category, LoadingChild, FoodItemVertical, MyStatusBar } from '../components'
import { useFocusEffect, CommonActions } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import * as actions from '../redux-saga/actions/main'
import { connect } from 'react-redux'
import Geolocation from '@react-native-community/geolocation'
import { request, PERMISSIONS } from 'react-native-permissions'
import AsyncStorage from '@react-native-community/async-storage'
import Images from '../assets/images/Images';

const width = Dimensions.get('window').width

function Main(props) {
    const [stores, setStores] = useState()
    // useFocusEffect(
    //     React.useCallback(() => {
    //         // Do something when the screen is focused
    //         return () => {
    //             // Do something when the screen is unfocused
    //             // Useful for cleanup functions

    //         }
    //     }, [])
    // )

    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // Screen was focused
    //         // Do something
    //     })

    //     return unsubscribe
    // }, [navigation])

    useEffect(() => {
        AsyncStorage.getItem('stores').then((res) => {
            setStores(JSON.parse(res).data)
        })
        props.getStoreCategory()

        requestLocationPermission()
        return () => {
        }
    }, [])


    function _renderBanner({ item, index }) {
        return (
            <View style={{
                backgroundColor: 'floralwhite',
                borderRadius: 5,
                height: 190,
                paddingVertical: 10,
                marginLeft: 0,
                marginRight: 0,
            }}>
                <Image resizeMode="cover" style={{ height: '100%', width: '100%', borderRadius: 5 }} source={{ uri: item.url }}></Image>
            </View>

        )
    }
    function _renderPromo({ item, index }) {
        return (
            <View style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                height: 100,
                paddingVertical: 10,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 10
            }}>
                <Image resizeMode="cover" style={{ height: '100%', width: '100%', borderRadius: 30 }} source={Images[item.url]}></Image>
            </View>

        )
    }

    function _renderCategory({ item }) {
        return (<Category
            name={item.label}
            image={item.image}
            keys={item.key}
        />)
    }

    function _renderStoreOne({ item }) {
        return <FoodItem
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.banner}
            description={item.description}
            distance={item.distance}
            promo={item.promo}
            star={4.5}
            topView={true}
        />
    }

    function _renderStoreTwo({ item }) {
        return <FoodItem
            name={item.name}
            price={item.price}
            image={item.image}
            distance={50.5}
        />
    }

    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            var respone = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            if (respone === 'granted')
                locateCurrentPosition()
        } else {
            var respone = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            if (respone === 'granted')
                locateCurrentPosition()
        }
    }

    function locateCurrentPosition() {
        Geolocation.getCurrentPosition(
            position => {
                props.getCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
                props.getAllStore({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            error => {
                props.getCurrentLocation({
                    lat: 10.825257491082173,
                    lng: 106.6800306617377
                })
                props.getAllStore({
                    lat: 10.825257491082173,
                    lng: 106.6800306617377
                })
            }, {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 3600000
        }
        )
    }

    let storeSortedByDistance = stores ? stores : props.stores

    storeSortedByDistance.sort((a, b) => {
        if (a.distance < b.distance)
            return -1;
        else
            return 1;
    })

    let listStoreDeal = storeSortedByDistance.length == 0 ?
        <View>
            <LoadingChild style={{ height: 246, backgroundColor: '#fff' }}></LoadingChild>
        </View>
        :
        <FlatList
            style={styles.foodList}
            data={storeSortedByDistance}
            keyExtractor={food => food._id.toString()}
            horizontal
            snapToAlignment="center"
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            renderItem={_renderStoreOne}
        />

    let listStoreSorted = storeSortedByDistance.length == 0 ?
        <LoadingChild style={{ height: 224, backgroundColor: '#fff' }}></LoadingChild>
        :
        (
            storeSortedByDistance.map((value, index) => {
                return <FoodItemVertical
                    id={value._id}
                    key={index}
                    name={value.name}
                    description={value.description}
                    image={value.banner}
                    distance={value.distance}
                    promo={value.promo}
                />
            })
        )



    return (
        <Screen style={styles.container}>
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            {/* <Header isHome={true}>HOME</Header> */}
            <ScrollView>
                <View style={styles.main}>
                    {/* <Carousel data={bannerSlide} /> */}
                    <Carousel
                        layout={"default"}
                        contentContainerCustomStyle={{ backgroundColor: 'floralwhite', }}
                        data={bannerSlide}
                        sliderWidth={width}
                        itemWidth={width - 60}
                        renderItem={_renderBanner}
                        loop={true}
                        autoplay={true}
                        autoplayInterval={3000}

                    />
                    {/* <TouchableOpacity onPress={() => navigation.navigate("Detail")}>
                    <Text>Go to Detail</Text>
                </TouchableOpacity> */}
                    <View style={styles.category}>
                        <FlatList
                            style={styles.dishList}
                            data={dishList}
                            keyExtractor={item => item.label.toString()}
                            horizontal
                            snapToAlignment="center"
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                            renderItem={_renderCategory}
                        />
                        <FlatList
                            style={styles.dishList}
                            data={dishList2}
                            keyExtractor={item => item.label.toString()}
                            horizontal
                            snapToAlignment="center"
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                            renderItem={_renderCategory}
                        />
                    </View>
                    <View>
                        <Text style={styles.title}>Deal Hot quanh đây</Text>
                        {
                            listStoreDeal
                        }

                    </View>
                    <View>
                        <Carousel
                            layout={"default"}
                            contentContainerCustomStyle={{}}
                            data={bannerPromo}
                            sliderWidth={width}
                            itemWidth={width / 2}
                            renderItem={_renderPromo}
                            loop={true}
                            autoplay={true}
                            autoplayInterval={3000}

                        />
                    </View>
                    <View>
                        <Text style={styles.title2}>Bán chạy nhất</Text>
                        <FlatList
                            style={styles.foodList2}
                            data={foodList}
                            keyExtractor={food => food.id.toString()}
                            horizontal
                            snapToAlignment="center"
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                            renderItem={_renderStoreTwo}
                        />
                        <FlatList
                            style={styles.foodList2}
                            data={foodList}
                            keyExtractor={food => food.id.toString()}
                            horizontal
                            snapToAlignment="center"
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                            renderItem={_renderStoreTwo}
                        />
                    </View>

                    <Text style={styles.title2}>Quán ngon quận mình</Text>
                    {
                        listStoreSorted
                    }

                </View>
            </ScrollView>
        </Screen >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {

    },
    title: {
        backgroundColor: '#fff',
        fontSize: 18,
        paddingLeft: 20,
        paddingTop: 10,
        fontWeight: 'bold'
    },
    title2: {
        fontSize: 18,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 5,
        fontWeight: 'bold'
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    foodList: {
        paddingLeft: 15,
        overflow: 'visible',
        backgroundColor: '#fff',
        paddingTop: 10,
        marginRight: 30
    },
    foodList2: {
        paddingLeft: 15,
        overflow: 'visible',
        marginRight: 30
    }
})

const mapStateToProps = (state) => {
    return {
        stores: state.stores
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getAllStore: function (location) {
            dispatch(actions.getStoreRequest(location))
        },
        getStoreCategory: function () {
            dispatch(actions.getStoresCategoryRequest())
        },
        getCurrentLocation: function (location) {
            dispatch(actions.getCurrentLocation(location))
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

const bannerPromo =
    [{
        title: 'Anise Aroma Art Bazar', url: 'Banner1',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 1
    },
    {
        title: 'Food inside a Bowl', url: 'Banner2',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 2
    },
    {
        title: 'Vegatable Salad', url: 'Banner3',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 3
    },

    ]

const bannerSlide =
    [{
        title: 'Anise Aroma Art Bazar', url: 'https://i.ibb.co/hYjK44F/anise-aroma-art-bazaar-277253.jpg',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 1

    },
    {
        title: 'Food inside a Bowl', url: 'https://i.ibb.co/JtS24qP/food-inside-bowl-1854037.jpg',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 2
    },
    {
        title: 'Vegatable Salad', url: 'https://i.ibb.co/JxykVBt/flat-lay-photography-of-vegetable-salad-on-plate-1640777.jpg',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 3
    },
    {
        title: 'Vegatable', url: 'https://i.pinimg.com/originals/ca/a9/64/caa9647eac746b499c501a62bbfc7487.png',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        id: 4
    }
    ]

const foodList = [
    {
        id: 1,
        name: 'Pizza',
        price: '20.000đ',
        distance: '4.5km',
        image: 'https://pizzalove.vn/wp-content/uploads/2020/03/cua-hang-banh-pizza-ngon-tai-hai-phong.jpg'
    },
    {
        id: 2,
        name: 'Chicken Fried',
        price: '20.000đ',
        distance: '4.5km',
        image: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/FB756ECF-34CD-42A6-8D91-47C6944EB93F/Derivates/6524a319-89db-46e5-9774-98e10794b47a.jpg'
    },
    {
        id: 3,
        name: 'Chicken Fried',
        price: '20.000đ',
        distance: '4.5km',
        image: 'https://le-cdn.websites.hibu.com/533c448531fc412eb9cff9ae03178687/dms3rep/multi/opt/small-3-640w.jpg'
    },
    {
        id: 4,
        name: 'Chicken Fried',
        price: '20.000đ',
        distance: '4.5km',
        image: 'https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/05/Pictures/_3062edc4-879d-11e9-ab40-33c30d629efb.jpg'
    },
    {
        id: 5,
        name: 'Chicken Fried',
        price: '20.000đ',
        distance: '4.5km',
        image: 'https://www.cancer.org/content/dam/cancer-org/images/photographs/single-use/espresso-coffee-cup-with-beans-on-table-restricted.jpg'
    },
    {
        id: 6,
        name: 'Chicken Fried',
        price: '20.000đ',
        distance: '4.5km',
        image: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/FB756ECF-34CD-42A6-8D91-47C6944EB93F/Derivates/6524a319-89db-46e5-9774-98e10794b47a.jpg'
    },
]

const dishList = [
    {
        image: 'Layer11',
        label: 'All',
        key: '1'
    },
    {
        image: 'Layer1',
        label: 'Đồ uống',
        key: '3'
    },
    {
        image: 'Layer3',
        label: 'Pizza/Burger',
        key: '7'
    },
    {
        image: 'Layer12',
        label: 'Spaghetti',
        key: '8'
    },
    {
        image: 'Layer5',
        label: 'Món nướng',
        key: '10'
    },
    {
        image: 'Layer6',
        label: 'Tráng miệng',
        key: '10'
    },
    {
        image: 'Layer7',
        label: 'Hải sản',
        key: '10'
    },
    {
        image: 'Layer8',
        label: 'Tươi sống',
        key: '10'
    },
    {
        image: 'Layer10',
        label: 'Món Hàn',
        key: '10'
    }
]

const dishList2 = [
    {
        image: 'Layer6',
        label: 'Fried Chicken',
        key: '10'
    },
    {
        image: 'Layer13',
        label: 'Healthy',
        key: '9'
    },
    {
        image: 'Layer15',
        label: 'Rice',
        key: '4'
    },
    {
        image: 'Layer14',
        label: 'Sushi',
        key: '6'
    }
]
