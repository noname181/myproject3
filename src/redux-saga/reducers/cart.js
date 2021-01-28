import * as types from '../constants';

// Initial State
const initialState = [];
// Redux: Counter Reducer
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case (types.ADD_TO_CART): {

            let newFood = true;
            let newState = state.map(value => {
                if (value.id == action.payload.id) {
                    value.amount += action.payload.amount;
                    value.total += action.payload.total;
                    newFood = false;
                    return value
                }
                else {
                    return value
                }
            })
            if (newFood) {
                newState = [...state, action.payload];
                newFood = true;
            }
            console.log(newState);
            return newState;
        }
        default: {
            return state;
        }
    }
};
// Exports
export default cartReducer;