import * as types from '../constants';

// Initial State
const initialState = {
    counter: [],
};
// Redux: Counter Reducer
const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.INCREASE_COUNTER: {
            let temp = state.counter;
            temp.push(Math.random());
            return {
                counter: temp,
            };
        }
        case types.DECREASE_COUNTER: {
            let temp = state.counter;
            temp.pop();
            return {
                ...state,
                counter: temp,
            };
        }
        default: {
            return state;
        }
    }
};
// Exports
export default counterReducer;