import * as types from '../constants';
import io from "socket.io-client/dist/socket.io.js";

var socket = io('https://restfull-api-nodejs-mongodb.herokuapp.com/', { jsonp: false });

// Initial State
const initialState = socket;
// Redux: Counter Reducer
const socketIOReducer = (state = initialState, action) => {
    switch (action.type) {

        default: {
            return state;
        }
    }
};
// Exports
export default socketIOReducer;