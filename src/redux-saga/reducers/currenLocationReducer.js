import * as types from '../constants'

// Initial State
const initialState = {}
// Redux: Counter Reducer
const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.CURRENT_LOCATION: {
            return action.payload
        }
        default: {
            return state
        }
    }
};
// Exports
export default counterReducer