import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RadioButton from './RadioButton';

function BottomSheet(props) {
    return (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
                height: 450,
                position: 'absolute',
                width: '100%'
            }}
        >
            <View>
                <RadioButton selected={true}></RadioButton>
                <RadioButton></RadioButton>
                <RadioButton></RadioButton>
                <RadioButton></RadioButton>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {}
});

export default BottomSheet;
