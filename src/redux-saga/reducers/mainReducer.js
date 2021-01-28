import * as types from '../constants';

// Initial State
const initialState = [];
// Redux: Counter Reducer
const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ALL_STORE: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
// Exports
export default mainReducer;