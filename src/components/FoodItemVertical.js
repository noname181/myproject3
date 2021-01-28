import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const width = Dimensions.get('window').width;

function FoodItem(props) {
    const navigation = useNavigation();
    const navigate = props.type === 'product' ? "ProductDetail" : "Store";

    return (
        <Pressable onPress={() => navigation.navigate(navigate, {
            id: props.id
        })} >
            <View style={styles.container}>
                {props.promo ? <Image source={require("../assets/images/best-quality.png")} style={{ position: 'absolute', height: 30, width: 30, zIndex: 1, left: 10 }} /> : null}
                <Image style={styles.image} source={{ uri: props.image }} />
                <View style={styles.info}>
                    <Text style={[styles.row, styles.name]}>
                        <Ionicons name='bookmarks-sharp' color={'#f75f2d'} size={18}></Ionicons>
                        {" " + props.name}
                    </Text>
                    <Text style={[styles.row, styles.address]} numberOfLines={2}>{props.description}</Text>
                    <Text style={[styles.row, styles.address]} numberOfLines={2}>{props.address}</Text>
                    {
                        props.distance ? <Text style={[styles.row, styles.distance]}>{(props.distance * 1.3).toFixed(2)}km</Text> : null
                    }

                    <Text style={[styles.row, styles.price]}>{props.price ? (props.price.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.')).slice(0, -4) + "đ" : null}</Text>
                </View>

            </View>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    image: {
        width: 90,
        height: 90,
        marginRight: 15
    },
    info: {
        width: width - 130
    },
    row: {
        marginBottom: 2
    },
    name: {
        display: 'flex',
        alignItems: 'center'
    },
    address: {
        color: 'gray',
        fontSize: 12
    },
    price: {
        color: '#f75f2d',
        fontSize: 12,
        letterSpacing: 0.5
    },
    distance: {
        color: '#000',
        fontSize: 12,
        letterSpacing: 0.5
    }
});

export default React.memo(FoodItem);
