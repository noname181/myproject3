import * as types from '../constants'

// Initial State
const initialState = null
// Redux: Counter Reducer
const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.CURRENT_ADDRESS: {
            return action.payload
        }
        default: {
            return state
        }
    }
};
// Exports
export default addressReducer