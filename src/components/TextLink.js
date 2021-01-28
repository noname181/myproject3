import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

function TextLink({ style, onPress, children }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.text, style]}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'blue'
    }
});

export default TextLink;