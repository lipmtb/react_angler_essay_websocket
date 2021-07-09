import {createStore,applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension"
import thunk from "redux-thunk";
import allReducer from "./reducers";
export default createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)));