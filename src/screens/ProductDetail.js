import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import Screen from '../components/Screen';
import MyStatusBar from '../components/MyStatusBar';
import { connect } from 'react-redux';
import * as actions from '../redux-saga/actions';

const width = Dimensions.get('window').width;
function ProductDetail(props) {
    const [product, setProduct] = useState({});
    const [amount, setAmount] = useState(1);
    const [total, setTotal] = useState(0);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        axios.get('https://restfull-api-nodejs-mongodb.herokuapp.com/foods/id/' + props.route.params.id).then(res => {
            setProduct(res.data);
            setTotal(res.data.price);
            setLoad(true);
        })
        return () => {
        };
    }, []);

    const descreaseCount = () => {
        let tempAmount = amount - 1;
        let tempPrice = tempAmount * product.price;
        if (tempAmount > 0) {
            setAmount(tempAmount);
            setTotal(tempPrice);
        }
    }
    const inscreaseCount = () => {
        let tempAmount = amount + 1;
        let tempPrice = tempAmount * product.price;
        setAmount(tempAmount);
        setTotal(tempPrice);
    }
    const addToCart = () => {
        props.onAddTocart({
            amount,
            total,
            name: product.name,
            id: product._id
        })
        props.navigation.goBack();
    }


    return (
        load ?
            <>
                <Screen>
                    <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                    <Header
                        style={{ borderBottomWidth: 0 }} styleIcon={{ backgroundColor: 'white' }}
                    >
                        {product.name}
                    </Header>
                    <ImageBackground source={{ uri: product.image }} style={{ height: 300, width: '100%' }}></ImageBackground>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={styles.name}>{product.name}</Text>
                            <Text style={styles.price}>{(product.price.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.')).slice(0, -4)}đ</Text>
                        </View>
                        <Text>{product.description}</Text>
                        <View style={styles.countProduct}>
                            <TouchableOpacity onPress={descreaseCount}>
                                <Text style={styles.options}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.amount}>{amount}</Text>
                            <TouchableOpacity onPress={inscreaseCount}>
                                <Text style={styles.options}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.cartBar} onPress={addToCart}>
                        <Text style={styles.cartText}>{amount} Món</Text>
                        <Text style={styles.cartText}>Thêm</Text>
                        <Text style={styles.cartText}>{(total.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.')).slice(0, -4)}đ</Text>
                    </TouchableOpacity>
                </Screen>
            </> :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
                <ActivityIndicator size="large" color="#f75f2d" />
            </View>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    name: {
        fontSize: 20,
        color: '#f75f2d'
    },
    price: {
        fontSize: 18,
        color: '#f75f2d'
    },
    countProduct: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        marginTop: 20
    },
    amount: {
        width: 50,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    options: {
        borderColor: '#f75f2d',
        borderWidth: 2,
        width: 40,
        height: 40,
        borderRadius: 20,
        textAlign: 'center',
        lineHeight: 37,
        fontSize: 20,
        color: '#f75f2d',
        fontWeight: 'bold'
    },
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    }
});

const mapStateToProps = (state) => {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onAddTocart: function (data) {
            dispatch(actions.addToCart(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
