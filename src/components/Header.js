import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Header = ({ children, style, isHome, styleIcon, isStore, onLike, onSearch, isLiked }) => {
    const navigation = useNavigation();

    return (
        <View style={[styles.header, style]}>
            {
                isHome ?
                    <View style={[styles.direct, styleIcon]}>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.toggleDrawer()}>
                            <Icon name='menu' color={'#f75f2d'} size={24} />
                        </TouchableOpacity>

                    </View>
                    :
                    <View style={[styles.direct, styleIcon]}>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
                            <Icon name='arrow-back' color={'#f75f2d'} size={24} />
                        </TouchableOpacity>

                    </View>
            }
            <Text style={[styles.title]}>{children}</Text>
            {
                isStore ?
                    <View style={{ position: 'absolute', flexDirection: 'row', right: 20, top: 16 }}>
                        <TouchableOpacity onPress={onLike}>
                            <MaterialCommunityIcons name={isLiked ? "heart" : "heart-outline"} size={25} color={isLiked ? "#f75f2d" : "#f75f2d"} style={{ marginRight: 15, position: 'relative', top: -3, right: 4 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSearch}>
                            <Icon name="md-search" size={22} color="#f75f2d" style={{ position: 'relative', top: -3, right: 4 }} />
                        </TouchableOpacity>
                    </View>
                    :
                    null
            }
        </View>
    )


};

const styles = StyleSheet.create({
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomWidth: 0,
        borderBottomColor: '#e9e9e9',
        flexDirection: 'row',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f75f2d',
        fontStyle: 'italic'
    },
    direct: {
        position: 'absolute',
        left: 15,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        height: '100%',
        justifyContent: 'center',
        width: 40,

    }
});
//export component để dùng ở 1 nơi khác
module.exports = Header;
