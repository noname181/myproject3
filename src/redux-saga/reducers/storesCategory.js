import * as types from '../constants';

// Initial State
const initialState = null;
// Redux: Counter Reducer
const storesCategory = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_STORES_CATEGORY: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
// Exports
export default storesCategory;