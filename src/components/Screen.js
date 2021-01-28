import React from 'react';
import { View, StyleSheet, SafeAreaView, NativeModules } from 'react-native';

function Screen({ children, style }) {
    return (
        <View style={[styles.screen, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff'
    }
});

export default Screen;
