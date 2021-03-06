import * as types from '../constants'

// Initial State
const initialState = {}
// Redux: Counter Reducer
const locationReducer = (state = initialState, action) => {
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
export default locationReducer