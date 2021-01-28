import {createStore} from 'redux'
import {GlobalState, rootReducer} from './reducer'

const initializeStore = (initialState: GlobalState) => createStore(rootReducer, initialState)

export default initializeStore