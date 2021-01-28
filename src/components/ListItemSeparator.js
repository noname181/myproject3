import React from 'react';
import { View, StyleSheet } from 'react-native';

function ListItemSeparator(props) {
    return (
        <View style={styles.separator}></View>
    );
}

const styles = StyleSheet.create({
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#e9e9e9'
    }
});

export default ListItemSeparator;
