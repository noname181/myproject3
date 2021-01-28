import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Button } from 'react-native';
import Header from '../components/Header';
import Screen from '../components/Screen';
import MyStatusBar from '../components/MyStatusBar';
import { connect } from 'react-redux';
import * as actions from '../redux-saga/actions';

const width = Dimensions.get('window').width;

function Cart(props) {

    let amount = total = 0;
    props.cart.map(value => {
        amount += value.amount;
        total += value.total;
    })

    return (
        <Screen style={styles.container}>
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Header
                style={{ borderBottomWidth: 0 }} styleIcon={{ backgroundColor: 'white' }}
            >
                Thu thập được gì nào?
            </Header>
            { props.cart.map((value, index) => {
                return (
                    <View key={value.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, paddingRight: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ width: 40, textAlign: 'center' }}>{value.amount}x</Text>
                            <Text>{value.name}</Text>
                        </View>

                        <Text>{(value.total.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.')).slice(0, -4)}đ</Text>
                    </View>
                )

            })}
            {/* <Button onPress={() => props.navigation.navigate('Test')} title="TEST"></Button> */}
            <TouchableOpacity style={styles.cartBar} >
                <Text style={styles.cartText}>{amount} Món</Text>
                <Text style={styles.cartText}>Thanh toán</Text>
                <Text style={styles.cartText}>{(total.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.')).slice(0, -4)}đ</Text>
            </TouchableOpacity>
        </Screen >
    );
}

const styles = StyleSheet.create({
    container: {
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
        cart: state.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);