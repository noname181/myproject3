import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import Images from '../assets/images/Images';
import { useNavigation } from '@react-navigation/native'

function Category(props) {
    let image = Images[props.image];
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("Detail", {
            keys: props.keys
        })}>
            <Image style={{ width: 80, height: 80 }} source={image}></Image>
            <Text style={styles.name}>{props.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginVertical: 20
    },
    name: {
        color: '#000'
    }
});

export default React.memo(Category);
