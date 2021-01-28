import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

function deleted(props) {
    console.log("render " + props.name);
    return (
        <View style={{ height: 20, width: '100%', backgroundColor: 'blue' }}>
            <Text style={{ color: 'white' }}>{props.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {}
});

export default deleted