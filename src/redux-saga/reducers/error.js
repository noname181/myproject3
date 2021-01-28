import * as types from '../constants';

// Initial State
const initialState = {
    counter: 0,
};
// Redux: Counter Reducer
const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.INCREASE_COUNTER: {
            return {
                ...state,
                counter: state.counter + 5,
            };
        }
        case types.DECREASE_COUNTER: {
            return {
                ...state,
                counter: state.counter - 1,
            };
        }
        default: {
            return state;
        }
    }
};
// Exports
export default errorReducer;