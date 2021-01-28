import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
const loading = require('../assets/images/loading.gif');

function Loading(props) {
    return (
        <View style={[styles.container, props.style]}>
            <Image resizeMode="cover" source={loading} style={styles.loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    loading: {
        width: 30,
        height: 30
    }
});

export default Loading;