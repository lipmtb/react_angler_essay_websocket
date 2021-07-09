import React, { Component } from 'react'
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom"
import PubSub from 'pubsub-js';
import "./index.less"
const http = require("http");
class HeaderNavCpn extends Component {
    state = {
        holderText: "输入关键词搜索",
        userinfo: null,
        newCacheInfo: null,
        oldCacheInfo: null,
        oldCacheShow: false,
        oldCacheHeight: 36,
        oldCacheWidth: 36,
        newHeight: 36,
        newWidth: 36
    }
    static getDerivedStateFromProps(newProps, newState) {
        // console.log("getDerivedStatefromProps",newProps.userinfo,newState);

        // if (newProps.userinfo && newState.userinfo) {
        //     if (newProps.userinfo.avatarUrl !== newState.userinfo.avatarUrl) {
        //         console.log("avatarUpdate", newProps.userinfo.avatarUrl, newState.userinfo.avatarUrl);

        //     }
        // }
        //存当前用户
        newState.userinfo = newProps.userinfo;

        return newState;
    }

    //存当前头像
    cacheImgFile = (e) => {
        console.log("newImgOnload");
        let that = this;
        let imgsource = e.currentTarget.src;
        let newAvatar = "/proxy1" + imgsource.slice(19);
        http.get(newAvatar, (incomming) => {
            console.log("incommingres", incomming.statusCode);
            let bufferAll = [];
            incomming.on("data", (chunk) => {
                bufferAll.push(chunk);
            })
            incomming.on("end", () => {
                let newCacheImg = Buffer.concat(bufferAll);
                console.log("bufferByteLength", newCacheImg.byteLength);
                let newObjUrl = document.defaultView.URL.createObjectURL(new File([newCacheImg], "cachefile", { type: 'image/png,image/jpeg,image/x-icon'}));
                let oldCacheInfo = this.state.newCacheInfo;

                if (oldCacheInfo) {
                    that.setState({
                        oldCacheInfo: oldCacheInfo,
                        oldCacheShow: true,
                        oldCacheHeight: 36,
                        oldCacheWidth: 36,
                        newHeight: 0,
                        newWidth: 0,
                        newCacheInfo: {
                            avatarUrl: newObjUrl,
                            avatarRadX: that.state.userinfo.avatarRadX,
                            avatarRadY: that.state.userinfo.avatarRadY
                        }

                    })
                } else {
                    that.setState({
                        oldCacheInfo: oldCacheInfo,
                        newCacheInfo: {
                            avatarUrl: newObjUrl,
                            avatarRadX: that.state.userinfo.avatarRadX,
                            avatarRadY: that.state.userinfo.avatarRadY
                        }

                    })
                }

                //缩小旧头像
                setTimeout(() => {
                    that.setState({
                        oldCacheHeight: 0,
                        oldCacheWidth: 0
                        
                    })
                }, 100)
            })
        })

    }

    showLoginReg = () => {
        PubSub.publish("tologin");
    }
    focusInput = () => {
        this.setState({
            holderText: ''
        })
    }
    blurSearchInput = () => {
        this.setState({
            holderText: '输入关键词搜索'
        })
    }
    //前往修改头像
    toChangeAvatarPage = () => {
        console.log("toChangeAvatar page", this.props);
        this.props.history.push("/changeavatar")
    }

    //新头像样式
    getBgAvatar = () => {
        let {
            avatarUrl,
            avatarRadX,
            avatarRadY
        } = this.props.userinfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: `${avatarRadX * 36}px`,
            backgroundPositionY: `${avatarRadY * 36}px`,
            height: this.state.newHeight + "px",
            width: this.state.newWidth + "px"
        }
    }

    //旧头像样式
    cacheImgBg = () => {
        let {
            avatarUrl,
            avatarRadX,
            avatarRadY
        } = this.state.oldCacheInfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: `${avatarRadX * 36}px`,
            backgroundPositionY: `${avatarRadY * 36}px`,
            display: this.state.oldCacheShow ? "block" : "none",
            height: this.state.oldCacheHeight + "px",
            width: this.state.oldCacheWidth + "px"
        }
    }

    //旧头像缩小结束，新头像变大
    oldEndAnimate = () => {
        this.setState({
            newHeight: 36,
            newWidth: 36,
            oldCacheShow:false
        })
    }

    render() {
        console.log("headerNav render", this.props);
        return (
            <div className="header-nav-wrapper">
                <h1 id="app-header-title">
                    angler垂钓
                </h1>
                <ul className="nav-lists">


                    <li className="nav-item">
                        <NavLink to="/talk">钓友圈</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/tip">技巧</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/profile">我的</NavLink>
                    </li>
                    {
                        this.state.userinfo && this.state.userinfo.avatarUrl ?
                            <img src={this.state.userinfo.avatarUrl} alt="hideimg" onLoad={this.cacheImgFile} style={{ display: "none" }}></img> : ""
                    }
                </ul>

                <div className="login-show-wrapper">
                    {
                        this.props.userinfo ?
                            <div className="login-userinfo">
                                {/* 登录完成显示 */}
                                <div className="user-info-top">
                                    {
                                        // 新头像
                                        this.props.userinfo.avatarUrl ? <span className="avatar-init"
                                            style={this.getBgAvatar()}>
                                        </span> :
                                            <span className="avatar-init avatar-bg"></span>
                                    }
                                    {
                                        // 旧头像
                                        this.state.oldCacheInfo ? <span className="cache avatar-init"
                                            style={this.cacheImgBg()} onTransitionEnd={this.oldEndAnimate}>
                                        </span> :
                                            ""
                                    }
                                    <span className="user-name-show">{this.props.userinfo.userName}</span>
                                </div>

                                <div className="change-avatar-btn" onClick={this.toChangeAvatarPage}>更换头像</div>
                            </div>
                            : <span className="login-span" onClick={this.showLoginReg}>登录/注册</span>
                    }

                </div>

                <div className="search-wrapper">
                    {/* 监听输入，回车键搜索 */}
                    <input type="text" name="searchinput" onBlur={this.blurSearchInput} onFocus={this.focusInput} placeholder={this.state.holderText} />
                    <i className="iconfont icon-xingtaiduICON_sousuo--"></i>
                </div>
            </div>
        )
    }
}

export default connect(state => ({ userinfo: state.userReducer.userinfo }))(withRouter(HeaderNavCpn));
