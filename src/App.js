import React, { Component,Fragment } from 'react'

import {connect} from "react-redux";

import HeaderNav from "components/headerNav"
import Content from 'components/content'
import LoginMod from "container/LoginMod"
import LoadingToggle from 'container/LoadingToggle';

import {testLoginAction} from "./redux/actions/loginAction"//是否登录
import "./App.css"
 class App extends Component {
   
    componentDidMount(){
       
        this.props.isloginAction();//是否登录

    }
  
   
    render() {
        console.log("App render",this.props);
        return (
            <Fragment>
                <HeaderNav/>
                <Content/>
                {/* <div style={{display:this.state.isShowLoginMod?'block':"none"}} className="login-reg">
                  <LoginMod closeLoginReg={this.closeLoginAndReg}/>
                </div> */}
                <LoginMod />
                <LoadingToggle/>
               
            </Fragment>
        )
    }
}


export default connect(state=>({isLogin:state.userReducer.isLogin}),{
    isloginAction:testLoginAction
})(App)