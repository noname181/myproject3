import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

function FoodItem(props) {
    const navigation = useNavigation();
    return (
        <View>

            <TouchableOpacity onPress={() => navigation.navigate("Store", {
                id: props.id
            })} style={styles.container}>
                {props.promo ? <Image source={require("../assets/images/best-quality.png")} style={{ position: 'absolute', height: 35, width: 35, zIndex: 1, left: -5, top: -7 }} /> : null}
                <Image style={{ width: 120, height: 120 }} source={{ uri: props.image }} />
                <Text numberOfLines={1} style={styles.name}>
                    <Ionicons name='bookmarks-sharp' color={'#f75f2d'} size={14}></Ionicons>
                    {" " + props.name}
                </Text>
                {
                    props.star ? <View style={styles.info}>
                        <MaterialIcons name="star" color='#ffd21f' size={15} />
                        <Text style={styles.point}>{props.star} (500+)</Text>
                    </View> : null
                }

                <View style={[styles.info, { marginVertical: 3 }]}>
                    <MaterialIcons name="alarm" color='#707070' size={12} />
                    <Text style={styles.distance}>{(props.distance * 1.3).toFixed(2)}km</Text>
                </View>
                <View style={[styles.info, props.price ? { marginVertical: 3 } : { display: 'none' }]}>
                    <FontAwesome name="money" color='#707070' size={12}></FontAwesome>
                    <Text style={styles.number_price}>{props.price}</Text>
                </View>
                <Text style={styles.promo} numberOfLines={1}>{props.description ? props.description : 'Giảm giá 20% khung giờ trưa'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 136,
        backgroundColor: '#ffffff',
        padding: 8,
        paddingTop: 8,
        elevation: 3,
        margin: 5,

    },
    name: {
        marginVertical: 5,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    point: {
        fontSize: 11,
        marginHorizontal: 5,
    },
    price: {
        fontSize: 11,
        marginRight: 3
    },
    number_price: {
        fontSize: 11,
        marginLeft: 5
    },
    promo: {
        fontSize: 11,
        color: '#afafaf'
    },
    distance: {
        marginLeft: 3,
        fontSize: 11
    }
});

export default React.memo(FoodItem);
