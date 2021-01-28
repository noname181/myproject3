import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Text, Animated, Image, ImageBackground, PanResponder, Platform, Dimensions, ActivityIndicator, StatusBar, SectionList, TouchableOpacity } from 'react-native';
import Screen from '../components/Screen';
import Header from '../components/Header';
import FoodItemVertical from '../components/FoodItemVertical';
import ListItemSeparator from '../components/ListItemSeparator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyStatusBar from '../components/MyStatusBar';
import axios from 'axios';
import { set } from 'react-native-reanimated';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useLinkTo } from '@react-navigation/native';

let topDirection = Platform.OS == 'android' ? StatusBar.currentHeight : 20;
let foodListHeight = Dimensions.get('window').height;
let sectionOffScroll = false;
const width = Dimensions.get('window').width;

const Item = ({ title, navigation }) => (

    <View style={styles.item}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>

    </View>
);

function Test(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const state = useNavigationState(state => state);
    const isFocused = useIsFocused();
    const linkTo = useLinkTo();

    console.log(state)

    console.log(navigation.dangerouslyGetState());
    return (
        <View>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <Item title={item} navigation={props.navigation} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                onViewableItemsChanged={({ viewableItems, changed }) => {
                    let length = viewableItems.length;
                    console.log(viewableItems[length - 1].section)
                    if (viewableItems[0].item.title)
                        console.log("Visible items :", viewableItems[0].item.title)
                    // console.log("Changed :", changed)
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 0 //means if 50% of the item is visible
                }}
                stickySectionHeadersEnabled={false}
                onEndReached={(data) => {
                    console.log('data', data); // { distanceFromEnd: -457 }
                    console.log('onEndReached');
                }}
                onEndReachedThreshold={0.1}
            />
        </View>
    );
}
[{ "index": null, "isViewable": true, "item": { "data": [Array], "title": "Main dishes" }, "key": "[object Object]null", "section": { "data": [Array], "title": "Main dishes" } },
{ "index": 0, "isViewable": true, "item": "Pizza", "key": "Pizza0", "section": { "data": [Array], "title": "Main dishes" } },
{ "index": 1, "isViewable": true, "item": "Burger", "key": "Burger1", "section": { "data": [Array], "title": "Main dishes" } },
{ "index": 2, "isViewable": true, "item": "Risotto", "key": "Risotto2", "section": { "data": [Array], "title": "Main dishes" } },
{ "index": null, "isViewable": true, "item": { "data": [Array], "title": "Sides" }, "key": "[object Object]null", "section": { "data": [Array], "title": "Sides" } },
{ "index": 0, "isViewable": true, "item": "French Fries", "key": "French Fries0", "section": { "data": [Array], "title": "Sides" } },
{ "index": 1, "isViewable": true, "item": "Onion Rings", "key": "Onion Rings1", "section": { "data": [Array], "title": "Sides" } },
{ "index": 2, "isViewable": true, "item": "Fried Shrimps", "key": "Fried Shrimps2", "section": { "data": [Array], "title": "Sides" } },
{ "index": null, "isViewable": true, "item": { "data": [Array], "title": "Drinks" }, "key": "[object Object]null", "section": { "data": [Array], "title": "Drinks" } },
{ "index": 0, "isViewable": true, "item": "Water", "key": "Water0", "section": { "data": [Array], "title": "Drinks" } }]

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24
    }
});

const DATA = [
    {
        title: "Main dishes",
        data: ["Pizza", "Burger", "Risotto"]
    },
    {
        title: "Sides",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Drinks",
        data: ["Water", "Coke", "Beer"]
    },
    {
        title: "Desserts",
        data: ["Cheese Cake", "Ice Cream"]
    },
    {
        title: "Sides 3",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Sides 4",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Sides 5",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Sides 6",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Sides 7",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    }
];

export default Test;