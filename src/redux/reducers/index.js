import { combineReducers } from 'redux'
import userReducer from './loginRegReducer'

import loadingReducer from './loadingReducer'
import  messageReducer  from './message'
export default combineReducers({ //总state的
    userReducer,
    loadingReducer,
    messageReducer
})