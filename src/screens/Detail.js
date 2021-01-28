import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Text, Animated, Image, ImageBackground, Buttonm, Platform, ActivityIndicator, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Screen from '../components/Screen';
import Header from '../components/Header';
import FoodItemVertical from '../components/FoodItemVertical';
import ListItemSeparator from '../components/ListItemSeparator';
import { useNavigation } from '@react-navigation/native';
import Backdrop from "../components/Backdrop";
import RadioButton from '../components/RadioButton';
import RadioButtonRN from 'radio-buttons-react-native';
import MyStatusBar from '../components/MyStatusBar';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import { connect } from 'react-redux';

let menuHeight = Platform.OS == 'android' ? 55 : 53;
const width = Dimensions.get('window').width;

function Detail(props) {
    const [selectedItem, setSelectedItem] = useState(Number(props.route.params.keys));
    const [visible, setVisible] = useState(false);
    const [load, setLoad] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [storesCategory, setStoresCategory] = useState(props.storesCategory);
    const navigation = useNavigation();
    const slideDown = useRef(new Animated.Value(0)).current;
    const menu = useRef();
    const carousel = useRef();

    useEffect(() => {
        setTimeout(() => {
            setLoad(true);
            //This line use to fix Backdrop element flash at start up
        })
        return () =>
            navigation.dangerouslyGetParent().setOptions({
                tabBarVisible: true
            });
    }, []);

    const onLoadMore = index => {
        setLoadMore(true);
        listCategory[index].page += 1;
        axios.get('https://restfull-api-nodejs-mongodb.herokuapp.com/stores/' + listCategory[index].key + '/' + listCategory[index].page * 10).then(res => {
            let listNew = [...storesCategory];
            listNew[index] = res.data;
            setStoresCategory(listNew);
            setLoadMore(false);
        })
    }
    const handleOpen = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };
    const onSlideDown = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(slideDown, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
    };
    return (
        load ?
            <>
                <Screen style={styles.container}>
                    <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                    <Header style={{ borderBottomWidth: 0 }}>Hôm nay ăn gì?</Header>
                    <View style={styles.listMenu}>
                        <FlatList
                            ref={menu}
                            data={listCategory}
                            horizontal
                            onScrollToIndexFailed={info => {
                                const wait = new Promise(resolve => setTimeout(resolve, 500));
                                wait.then(() => {
                                    menu.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
                                });
                            }}
                            getItemLayout={(data, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                            contentContainerStyle={{ overflow: 'visible', borderLeftWidth: 20, borderColor: '#fff' }}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity
                                    style={selectedItem === item.id ? [styles.item, styles.active] : styles.item}
                                    onPress={() => {
                                        setSelectedItem(item.id);
                                        carousel.current.snapToItem(index, animated = true);
                                        menu.current.scrollToIndex({ animated: true, index: index, viewPosition: 0 });
                                    }}
                                >
                                    <Text style={selectedItem === item.id ? { color: 'white', fontWeight: 'bold' } : { color: '#000' }}>{item.name}</Text>
                                </TouchableOpacity>

                            }
                        />
                    </View>

                    <View style={styles.topBar}>
                        <View style={styles.barItem}>
                            <Text style={{ marginRight: 5 }}>Best Restaurent</Text>
                            <FontAwesome name="question-circle-o" size={12}></FontAwesome>
                        </View>
                        <TouchableOpacity style={[styles.barItem, styles.filter]} onPress={() => {
                            navigation.dangerouslyGetParent().setOptions({
                                tabBarVisible: false
                            });
                            setTimeout(() => { setVisible(true); })

                        }}>
                            <Text style={{ marginRight: 5 }}>Filter</Text>
                            <Image style={{ height: 10, width: 12 }} source={require('../assets/images/icon-filter.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <Carousel
                        ref={carousel}
                        layout={"default"}
                        data={listCategory}
                        sliderWidth={width}
                        itemWidth={width}
                        firstItem={selectedItem - 1}
                        initialNumToRender={listCategory.length}
                        onScrollToIndexFailed={info => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                carousel.current?.scrollToIndex({ index: info.index, animated: true });
                            });
                        }}
                        onLayout={() => {
                            setTimeout(() => {
                                menu.current?.scrollToIndex({ index: selectedItem - 1, animated: true, viewPosition: 0 });
                            }, 0)

                        }}
                        onSnapToItem={index => {
                            setSelectedItem(index + 1);
                            menu.current.scrollToIndex({ animated: true, index: index, viewPosition: 0 });
                        }}
                        renderItem={({ item, index }) => {
                            return <FlatList
                                refreshing={false}
                                style={styles.foodList}
                                data={storesCategory[index]}
                                extraData={props}
                                keyExtractor={food => food._id.toString()}
                                snapToAlignment="center"
                                scrollEventThrottle={16}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 38 }}
                                onRefresh={() => {
                                    setTimeout(() => { }, 500)
                                    return;
                                }}
                                onEndReachedThreshold={0.2}
                                onEndReached={({ distanceFromEnd }) => {
                                    if (distanceFromEnd < 0) return;
                                    onLoadMore(index);
                                }}
                                renderItem={({ item }) =>
                                    <FoodItemVertical
                                        name={item.name}
                                        address={item.address}
                                        image={item.banner}
                                        distance={item.distance}
                                        id={item._id}
                                        type={"store"}
                                    />
                                }
                                ItemSeparatorComponent={ListItemSeparator}
                                ListEmptyComponent={<View style={{ alignItems: 'center', flex: 1, height: 500, justifyContent: 'center' }}>
                                    <Image source={require('../assets/images/empty.png')}></Image>
                                </View>}
                                ListFooterComponent={loadMore ? <View
                                    style={{
                                        paddingBottom: 15,

                                    }}
                                >
                                    <ActivityIndicator animating size="large" color="#f75f2d" />
                                </View> : null}
                            />
                        }

                        }
                        loop={false}
                        autoplay={false}
                    />


                </Screen>

                <Backdrop
                    visible={visible}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    beforeClose={() => {
                        navigation.dangerouslyGetParent().setOptions({
                            tabBarVisible: true
                        });
                        setTimeout(() => {
                            onSlideDown();
                        })
                    }}
                    swipeConfig={{
                        velocityThreshold: 0.3,
                        directionalOffsetThreshold: 80,
                    }}
                    animationConfig={{
                        speed: 14,
                        bounciness: 4,
                    }}
                    overlayColor="rgba(0,0,0,0.5)"
                    backdropStyle={{
                        backgroundColor: '#fff',
                    }}>
                    <View>
                        <View style={styles.headerBottomSheet}>
                            <Text>Header</Text>
                        </View>
                        <View>
                            <RadioButtonRN
                                data={dishList}
                                selectedBtn={(e) => console.log(e)}
                                style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingBottom: 20, borderBottomColor: "#e9e9e9", borderBottomWidth: 1 }}
                                boxStyle={{
                                    borderWidth: 0, width: '50%', marginTop: 15
                                }}
                                activeColor='#f75f2d'
                                box={false}
                                textStyle={{ margin: 0, padding: 0 }}
                                textColor="#000"
                                initial={1}
                            />
                            <RadioButtonRN
                                data={district}
                                selectedBtn={(e) => console.log(e)}
                                style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingBottom: 20 }}
                                boxStyle={{
                                    borderWidth: 0, width: '50%', marginTop: 15
                                }}
                                activeColor='#f75f2d'
                                box={false}
                                textStyle={{ margin: 0, padding: 0 }}
                                textColor="#000"
                                initial={1}
                            />
                        </View>
                        <TouchableOpacity style={styles.bottombtn}>
                            <Text style={{ color: 'white' }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </Backdrop>

            </> :
            <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                <ActivityIndicator size="large" color="#f75f2d" />
            </Screen>
    );
}

const styles = StyleSheet.create({
    container: {},
    listMenu: {
        borderBottomColor: '#e9e9e9',
        marginLeft: 0,
        overflow: 'visible',
        borderBottomWidth: 1,
        height: menuHeight,
        position: 'absolute',
        top: Platform.OS == 'android' ? StatusBar.currentHeight + 38 : 58,
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        marginRight: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15
    },
    active: {
        color: '#fff',
        backgroundColor: '#f75f2d',
        borderColor: '#f75f2d',

    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#e9e9e9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        top: 38,
        zIndex: 100
    },
    barItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30
    },
    filter: {
        backgroundColor: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 30

    },
    headerBottomSheet: {
        backgroundColor: "#e9e9e9",
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottombtn: {
        backgroundColor: '#f75f2d',
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    foodList: {
        top: 38,
        height: '100%',
        width: '100%',
    },
});

const mapStateToProps = (state) => {
    return {
        storesCategory: state.storesCategory
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);


const district = [
    {
        label: 'Quận 1'
    },
    {
        label: 'Quận 2'
    },
    {
        label: 'Quận Gò Vấp'
    },
    {
        label: 'Quận Bình Thạnh'
    },
]

const dishList = [
    {
        label: 'Đồ ăn'
    },
    {
        label: 'Đồ uống'
    },
    {
        label: 'Pizza/Burger'
    },
    {
        label: 'Món lẩu'
    },
    {
        label: 'Món nướng'
    },
    {
        label: 'Gần bạn'
    }
];
const listCategory = [
    { id: 1, name: "All", key: "all", page: 1 }, { id: 2, name: "Foods", key: "foods", page: 1 }, { id: 3, name: "Drink", key: "drink", page: 1 }, { id: 4, name: "Rice", key: "rice", page: 1 }, { id: 5, name: "Coffee", key: "coffee", page: 1 }, { id: 6, name: "Sushi", key: "sushi", page: 1 }, { id: 7, name: "Pizza/Burger", key: "pizza,burger", page: 1 }, { id: 8, name: "Spaghetti", key: "spaghetti", page: 1 }, { id: 9, name: "Healthy", key: "healthy", page: 1 }
]

const foodList = [
    {
        id: 1,
        name: 'Pizza',
        price: '3$',
        distance: '4.5km',
        image: 'https://pizzalove.vn/wp-content/uploads/2020/03/cua-hang-banh-pizza-ngon-tai-hai-phong.jpg'
    },
    {
        id: 2,
        name: 'Chicken Fried',
        price: '2$',
        distance: '4.5km',
        image: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/FB756ECF-34CD-42A6-8D91-47C6944EB93F/Derivates/6524a319-89db-46e5-9774-98e10794b47a.jpg'
    },
    {
        id: 3,
        name: 'Chicken Fried',
        price: '2$',
        distance: '4.5km',
        image: 'https://le-cdn.websites.hibu.com/533c448531fc412eb9cff9ae03178687/dms3rep/multi/opt/small-3-640w.jpg'
    },
    {
        id: 4,
        name: 'Chicken Fried',
        price: '2$',
        distance: '4.5km',
        image: 'https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/05/Pictures/_3062edc4-879d-11e9-ab40-33c30d629efb.jpg'
    },
    {
        id: 5,
        name: 'Chicken Fried',
        price: '2$',
        distance: '4.5km',
        image: 'https://www.cancer.org/content/dam/cancer-org/images/photographs/single-use/espresso-coffee-cup-with-beans-on-table-restricted.jpg'
    },
    {
        id: 6,
        name: 'Chicken Fried',
        price: '2$',
        distance: '4.5km',
        image: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/FB756ECF-34CD-42A6-8D91-47C6944EB93F/Derivates/6524a319-89db-46e5-9774-98e10794b47a.jpg'
    },
]
