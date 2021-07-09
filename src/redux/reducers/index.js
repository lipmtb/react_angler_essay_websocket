import { combineReducers } from 'redux'
import userReducer from './loginRegReducer'

import loadingReducer from './loadingReducer'
export default combineReducers({ //总state的
    userReducer,
    loadingReducer
})