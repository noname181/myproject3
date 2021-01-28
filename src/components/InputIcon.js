import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function InputIcon({ name, style, ...props }) {
    return (
        <View style={styles.inputIcon}>
            <MaterialCommunityIcons name={name} size={20} color="#f75f2d" style={styles.icon} />
            <TextInput {...props} style={[styles.input, style]}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    inputIcon: {
        flexDirection: 'row',
        height: 50,
    },
    icon: {
        position: 'absolute',
        zIndex: 1,
        top: 10
    },
    input: {
        paddingLeft: 30
    }
});

export default InputIcon;