import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

function MyButton({ children, style, textStyle, icon, onPress }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            {icon}
            <Text style={[styles.text, textStyle]}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
});

export default MyButton;
