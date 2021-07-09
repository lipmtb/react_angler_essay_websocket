import React, { Component,lazy } from 'react'
import {connect} from "react-redux"
import { Route, Switch } from 'react-router-dom'
import pubsub from "pubsub-js";
const ChangeAvatarPage=lazy(()=>import("container/ChangeAvatar"))

class LoginTest extends Component {
    render() {

        if(this.props.isLogin){
            return (
                <Switch>
                    <Route path="/changeavatar" component={ChangeAvatarPage}></Route>
                   
                </Switch>
            )
        }else{
            console.log("pubsub**********************tologin");
            pubsub.publish("tologin")
            return "";
        }
      
    }
}

export default connect(state=>({isLogin:state.userReducer.isLogin}))(LoginTest);
