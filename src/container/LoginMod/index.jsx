import React, { Component } from 'react'
import { connect } from "react-redux";
import PubSub from 'pubsub-js';
import { loginAction, registAction } from "../../redux/actions/loginAction"
import "./index.less"
/**
 * 登录注册
 */
class LoginModBox extends Component {
    constructor(props) {
        super(props);
        this.lusernameint = React.createRef();//登录昵称
        this.luserpswint = React.createRef();//登录密码

        this.rusernameint = React.createRef(); //注册昵称
        this.rpswint = React.createRef();//注册密码
        this.rpswconfirmint = React.createRef();//注册确认
        this.loginTimer = null;//登录节流
        this.regTimer = null;//注册节流
    }
    state = {
        curTabIdx: 1,//1：登录 0：注册
        initColor: '#ccc',
        canLogin: false,
        btnStatus: "not-allowed",
        rinitColor: '#ccc',
        rcanLogin: false,
        rbtnStatus: "not-allowed",
        passwordErr: '',
        isShowLoginMod: false
    }
    static getDerivedStateFromProps(newProps){
        // console.log("loginMod getDerivedStateFromProps",newProps,newState);
        if(newProps.isLogin){
            return {
                isShowLoginMod:false
            }
        }
        return null;
    }

    componentDidMount() {
        PubSub.subscribe("tologin", () => {
            console.log("***********打开登录框");
            this.setState({
                isShowLoginMod: true
            })
        })
    }
    // showLoginMod=()=>{
    //     this.setState({
    //         isShowLoginMod:true
    //     })
    // }
    closeLoginAndReg=()=>{
        this.setState({
            isShowLoginMod:false
        })
    }

    //进行登录,redux保存
    loginApp = () => {

        let loginusername = this.lusernameint.current.value.trim();
        let loginpsw = this.luserpswint.current.value.trim();
        // login(loginusername,loginpsw).then((loginres)=>{
        //     console.log("登录结果",loginres);
        // })
        this.props.loginOperation(loginusername, loginpsw);
    }
    //进行注册并登录，redux保存
    registApp = () => {

        let regusername = this.rusernameint.current.value.trim();
        let reguserpsw = this.rpswint.current.value.trim();
        let reguserpswconfirm = this.rpswconfirmint.current.value.trim();
        if (reguserpswconfirm !== reguserpsw) {
            this.setState({
                passwordErr: '确认密码和密码不一致'
            })
            return;
        }
        this.setState({
            passwordErr: ''
        })
        this.props.registOperation(regusername, reguserpsw)


    }

    // 切换登录注册
    changeTab = (tabIdx) => {
        return () => {
            this.setState({ curTabIdx: tabIdx })
        }
    }

    //登录输入改变btn状态
    loginChangeInt = () => {
        // console.log("登录change");

        clearTimeout(this.loginTimer);
        this.loginTimer = setTimeout(() => {
            // console.log("登录change");
            let loginusername = this.lusernameint.current.value.trim();
            let loginpsw = this.luserpswint.current.value.trim();
            if (loginusername.length > 0 && loginpsw.length > 0) {
                this.setState({
                    initColor: '#008c8c',
                    canLogin: true,
                    btnStatus: "pointer"
                })
            } else {
                this.setState({
                    initColor: '#ccc',
                    canLogin: false,
                    btnStatus: "not-allowed"
                })
            }
        }, 200)

    }

    //注册改变btn状态
    regChangeInputInfo = () => {
        clearTimeout(this.regTimer);
        this.regTimer = setTimeout(() => {
            // console.log("注册change");
            let regusername = this.rusernameint.current.value.trim();
            let reguserpsw = this.rpswint.current.value.trim();
            let reguserpswconfirm = this.rpswconfirmint.current.value.trim();
            if (regusername.length > 0 && reguserpsw.length > 0 && reguserpswconfirm.length > 0) {
                this.setState({
                    rinitColor: '#008c8c',
                    rcanLogin: true,
                    rbtnStatus: "pointer"
                })
            } else {
                this.setState({
                    rinitColor: '#ccc',
                    rcanLogin: false,
                    rbtnStatus: "not-allowed"
                })
            }
        }, 200)
    }
    render() {
        // console.log("loginMod render", this.props);
        return (
            <div style={{ display: this.state.isShowLoginMod ? 'block' : "none" }} className="login-reg">

                <div className="user-login-regist">

                    <i className="iconfont  icon-guanbi" onClick={this.closeLoginAndReg}></i>

                    {/* 登录注册切换 */}
                    <div className="log-reg-ch" >
                        <span className="tab-text tab-login" style={{ color: this.state.curTabIdx ? '#00c' : '#999' }} onClick={this.changeTab(1)}>登录</span>

                        <b className="split-line">|</b>
                        <span className="tab-text tab-reg" style={{ color: !this.state.curTabIdx ? '#00c' : '#999' }} onClick={this.changeTab(0)}>注册</span>
                        <span className="react-angle" style={{ left: this.state.curTabIdx ? "148px" : "213px" }}></span>
                    </div>

                    {
                        this.state.curTabIdx ? <div className="user-input-info" key="login-box" onChange={this.loginChangeInt}>

                            <input type="text" ref={this.lusernameint} className="ui-login-input" name="username" id="lusername" placeholder="昵称" />
                            <input type="password" ref={this.luserpswint} name="password" id="luserpsw" placeholder="密码" />
                            <input type="submit" value="登录" onClick={this.loginApp} disabled={!this.state.canLogin} style={{ backgroundColor: this.state.initColor, cursor: this.state.btnStatus }} />
                        </div> : <div className="user-input-info" key="reg-box" onChange={this.regChangeInputInfo}>

                            <input type="text" ref={this.rusernameint} className="ui-reg-input" name="username" id="regusername" placeholder="昵称" />
                            <input type="password" ref={this.rpswint} name="password" id="luserpsw" placeholder="密码4-16位" />
                            <input type="password" ref={this.rpswconfirmint} name="password" id="reuserpsw" placeholder="确认密码" />
                            <input type="submit" value="注册" onClick={this.registApp} disabled={!this.state.rcanLogin} style={{ backgroundColor: this.state.rinitColor, cursor: this.state.rbtnStatus }} />
                        </div>
                    }
                    {
                        this.props.errCode ?
                            <div className="err-show" >
                                <span className="err-text">{this.props.errMsg}</span>
                            </div> : ""
                    }

                    {
                        this.state.passwordErr ?
                            <div className="err-show" >
                                <span className="err-text">{this.state.passwordErr}</span>
                            </div> : ""
                    }


                </div>
            </div>
        )
    }
}


export default connect(state => ({ isLogin: state.userReducer.isLogin, errCode: state.userReducer.errCode, errMsg: state.userReducer.errMsg }), {
    loginOperation: loginAction,
    registOperation: registAction
})(LoginModBox);