import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

function MyStatusBar({ backgroundColor, ...props }) {
    const isFocused = useIsFocused();

    return isFocused ? (
        <View style={[styles.statusBar, { backgroundColor }]}>
            <StatusBar translucent={true} backgroundColor={backgroundColor} {...props} />
        </View>
    ) : <View style={[styles.statusBar]}>
        </View>
};

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
});

export default MyStatusBar;