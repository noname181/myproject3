import React, { useEffect, useState, memo } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Text, Button, FlatList } from 'react-native';
import { Screen, Loading, Header, MyButton, MyStatusBar, ErrorMessage, TextLink, InputIcon } from '../components';
import { connect } from 'react-redux';
import * as actions from '../redux-saga/actions';
import Deleted from './delete';


function ForgotPassword(props) {
    const [bgColor, setBgColor] = useState('yellow');

    props.socket.on('response-color', (data) => {
        setBgColor(data);
    })

    useEffect(() => {
        return () => {
        };
    }, []);
    emitSocket = () => {
        let color = ['blue', 'yellow', 'red', 'pink', 'gray', 'green', 'violet'];
        let random = Math.round(Math.random() * 6);
        props.socket.emit('send-color', color[random]);
    }
    onAdd = () => {
        props.onInscrease();
    }
    onMinus = () => {
        props.onDescrease();
    }
    render = ({ item }) =>
        <Deleted
            name={item}
        >
        </Deleted>

    return (
        <View style={styles.container}>
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Text>{props.counter.counter.length}</Text>
            <Button title="Add" onPress={onAdd}></Button>
            <Button title="minus" onPress={onMinus}></Button>
            <Button title="socketIO" onPress={emitSocket}></Button>
            <FlatList
                style={{ flex: 1, backgroundColor: bgColor }}
                data={props.counter.counter}
                keyExtractor={(item) => item.toString()}
                renderItem={render} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },

});

const mapStateToProps = (state) => {
    return {
        counter: state.counter,
        socket: state.socket
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onInscrease: function () {
            dispatch(actions.inscreaseCounterAsync())
        },
        onDescrease: function () {
            dispatch(actions.descreaseCounter())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);