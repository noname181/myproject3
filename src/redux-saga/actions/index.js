import * as types from '../constants';
import axios from 'axios';



export const inscreaseCounterAsync = () => {
    return (dispatch) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res("ok");
            }, 1000)
        }).then(res => {
            dispatch(inscreaseCounter());
        })
    }
}
export const inscreaseCounter = () => {
    return {
        type: types.INCREASE_COUNTER
    }
}
export const descreaseCounter = () => {
    return {
        type: types.DECREASE_COUNTER
    }
}
export const addToCart = (payload) => {
    return {
        type: types.ADD_TO_CART,
        payload
    }
}

