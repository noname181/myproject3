import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageBackground } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import AuthContext from '../hooks/AuthContext';


import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export function DrawerContent(props) {
    const [route, setRoute] = useState('home');
    const authContext = useContext(AuthContext);

    return (
        <DrawerContentScrollView {...props}>
            <ImageBackground resizeMode='cover' source={{ uri: 'https://img.freepik.com/free-vector/neon-lights-wallpaper_52683-46462.jpg?size=626&ext=jpg' }} style={{ height: 200, width: '100%', marginTop: -24, borderBottomColor: "#e9e9e9", borderBottomWidth: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={authContext.user ? { uri: 'https://svhutech.nonamee.com/upload/' + authContext.user['image'] } : require('../assets/images/avatar.jpg')} style={{ height: 80, width: 80, borderRadius: 40, marginHorizontal: 20 }}></Image>
                <View style={{}}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 20, color: 'white' }}>{authContext.user ? authContext.user['name'] : null} </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialCommunityIcons name="phone" size={16} color="#f75f2d" />
                        <Text style={{ fontWeight: 'bold', marginLeft: 8, fontSize: 12, color: "white" }}>081-952-1414</Text>
                    </View>

                </View>
            </ImageBackground>
            <View>
                <DrawerItem
                    {...props}
                    style={styles.rows}
                    focused={route == 'home' ? true : false}
                    icon={({ color, size }) => (
                        <Icon
                            name="home"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Home"
                    onPress={() => {
                        setRoute('home')
                        console.log(props.drawerContentOptions)
                        props.navigation.navigate('Main')
                    }}
                />
                {/* <DrawerItem
                    {...props}
                    style={styles.rows}
                    focused={route == 'login' ? true : false}
                    icon={({ color, size }) => (
                        <Icon
                            name="account"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Login"
                    onPress={() => {
                        setRoute('login')
                        props.navigation.navigate('Login')
                    }}
                /> */}
                <DrawerItem
                    {...props}
                    style={styles.rows}
                    focused={route == 'notification' ? true : false}
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons
                            name="bell"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Notification"
                    onPress={() => {
                        setRoute('notification')
                        props.navigation.navigate('Notification')
                    }}
                />
                <DrawerItem
                    {...props}
                    style={styles.rows}
                    focused={route == 'wishlist' ? true : false}
                    icon={({ color, size }) => (
                        <Icon
                            name="heart"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Wishlist"
                    onPress={() => {
                        setRoute('wishlist')
                        props.navigation.navigate('Wishlist')
                    }}
                />
                {/* <DrawerItem
                    {...props}
                    style={styles.rows}
                    focused={route == 'autocomplete' ? true : false}
                    icon={({ color, size }) => (
                        <Icon
                            name="heart-outline"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Autocomplete"
                    onPress={() => {
                        setRoute('autocomplete')
                        props.navigation.navigate('Autocomplete')
                    }}
                /> */}
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    rows: {
        borderRadius: 0,
        marginTop: 0,
        marginBottom: 10,
        paddingHorizontal: 10
    }
});
