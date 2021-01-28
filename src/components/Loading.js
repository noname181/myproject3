import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
const loading = require('../assets/images/loading.gif');

function Loading(props) {
    return (
        <View style={styles.container}>
            <Image resizeMode="cover" source={loading} style={styles.loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000",
        opacity: 0.3,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loading: {
        width: 70,
        height: 70
    }
});

export default Loading;