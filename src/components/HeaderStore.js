import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const width = Dimensions.get('window').width

function HeaderStore({ store, distance }) {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View style={styles.infoIcon}>
                    <Ionicons name="information-circle-outline" size={25} color="#000"></Ionicons>
                </View>

                <View style={{ position: "absolute", top: 8, alignItems: 'center' }}>
                    <Ionicons name="bookmark-sharp" size={25} color="#f75f2d" style={{ position: "relative", top: -11 }}></Ionicons>
                    <Text style={{ fontSize: 15, color: '#f75f2d', position: "relative", top: -10 }}>NONAME'S PARTNER</Text>
                </View>

                <Text numberOfLines={2} style={styles.name}>{store.name}</Text>
                <View style={{ marginHorizontal: 40, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text numberOfLines={2} style={{ textAlign: 'center' }}>{distance} - {store.address}</Text>
                </View>
            </View>
            <View style={styles.backdrop}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 260,
        paddingHorizontal: 20,
        paddingTop: 20,
        position: 'relative'
    },
    info: {
        backgroundColor: '#fff',
        minHeight: '55%',
        width: '100%',
        borderRadius: 8,
        position: 'absolute',
        left: 20,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        bottom: 10,
        shadowColor: '#a1a1a1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        paddingTop: 50,
        paddingBottom: 20
    },
    infoIcon: {
        position: 'absolute',
        right: 10,
        top: -15,
        backgroundColor: '#fff',
        width: 32,
        height: 32,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#a1a1a1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
        marginBottom: 5,
        marginHorizontal: 20
    },
    backdrop: {
        backgroundColor: '#fff',
        height: '40%',
        width: width + 40,
        position: 'absolute',
        bottom: 0,
        zIndex: 1
    }
});

export default HeaderStore;