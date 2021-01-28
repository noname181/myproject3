import React from 'react';
import { StyleSheet, Text } from 'react-native';

function ErrorMessage({ error, style }) {
    return (
        <Text style={[styles.error, style]}>{error}</Text>
    );
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 5
    }
});

export default ErrorMessage;