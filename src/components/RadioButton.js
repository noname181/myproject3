import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

function RadioButton(props) {
    return (
        <TouchableOpacity style={[{
            height: 24,
            width: 24,
            borderRadius: 12,
            backgroundColor: '#e9e9e9',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
        }, props.style]}>
            <View>
                {
                    props.selected ?
                        <View style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: '#f75f2d',
                        }} />
                        : null
                }
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {}
});

export default RadioButton;
