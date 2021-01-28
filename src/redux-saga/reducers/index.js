// Imports: Dependencies
import { combineReducers } from 'redux'
import counterReducer from './counterReducer'
import mainReducer from './mainReducer'
import socketIO from './socketIO'
import storesCategoryReducer from './storesCategory'
import cartReducer from './cart'
import currentLocationReducer from './currenLocationReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
    counter: counterReducer,
    stores: mainReducer,
    socket: socketIO,
    storesCategory: storesCategoryReducer,
    cart: cartReducer,
    currentLocation: currentLocationReducer
});
// Exports
export default rootReducer