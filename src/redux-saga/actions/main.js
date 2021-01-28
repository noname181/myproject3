import * as types from '../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'


const listCategory = [
    { id: 1, name: "All", key: "all", page: 1 }, { id: 2, name: "Foods", key: "foods", page: 1 }, { id: 3, name: "Drink", key: "drink", page: 1 }, { id: 4, name: "Rice", key: "rice", page: 1 }, { id: 5, name: "Coffee", key: "coffee", page: 1 }, { id: 6, name: "Sushi", key: "sushi", page: 1 }, { id: 7, name: "Pizza/Burger", key: "pizza,burger", page: 1 }, { id: 8, name: "Spaghetti", key: "spaghetti", page: 1 }, { id: 9, name: "Healthy", key: "healthy", page: 1 }
]

export const getStoreRequest = (payload) => {

    return (dispatch) => {
        axios.get('https://restfull-api-nodejs-mongodb.herokuapp.com/stores/location/' + payload.lat + '/' + payload.lng)
            .then(res => {
                dispatch(getStore(res));
            })
    }
}
export const getStore = (res) => {
    AsyncStorage.setItem('stores', JSON.stringify(res))
    return {
        type: types.GET_ALL_STORE,
        payload: res.data
    }
}

const asyncFunction = async () => {
    let storeCategory = [];
    await Promise.all(listCategory.map(async (value, index) => {
        let result = await axios.get('https://restfull-api-nodejs-mongodb.herokuapp.com/stores/' + value.key + '/' + value.page * 10);
        storeCategory[index] = result.data;

    }));
    return new Promise((res, rej) => {
        res(storeCategory);
    });
}

export const getStoresCategoryRequest = () => {
    return (dispatch) => {
        return asyncFunction().then(res => {
            dispatch(getStoresCategory(res));
        })
    }
}

export const getStoresCategory = (payload) => {
    return {
        type: types.GET_STORES_CATEGORY,
        payload
    }
}

export const getCurrentLocation = (payload) => {
    return {
        type: types.CURRENT_LOCATION,
        payload
    }
}
