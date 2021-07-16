import React, { Component } from 'react'
import { connect } from 'react-redux'
import pubsub from "pubsub-js"
import Clock from './Clock';

import { Switch, Route } from "react-router-dom";
import UserSend from './UserSend';
import UserMessage from './UserMessage';


import "./index.less";
class ProfilePageUI extends Component {

    getAvatarStyle = (userInfo) => {
        let {
            avatarUrl,
            avatarRadX,
            avatarRadY
        } = userInfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: 36 * avatarRadX + "px",
            backgroundPositionY: 36 * avatarRadY + "px"

        }
    }

    //显示登录组件
    showLoginMod = () => {
        pubsub.publish("tologin");
    }
    toMySend = (type) => {
        return () => {

            this.props.history.replace("/profile/usersend", { sendType: type });
        }
    }
    toMyMessage = () => {
        this.props.history.replace("/profile/usermessage");
    }
    render() {
        return (
            <div className="profile-wrapper">
                <div className="user-info-top">
                    {
                        this.props.userInfo ? <div className="login-userinfo">
                            {
                                this.props.userInfo.avatarUrl ? <i className="avatar-init" style={this.getAvatarStyle(this.props.userInfo)}></i> :
                                    <i className="avatar-init avatar-bg"></i>
                            }

                            <span>{this.props.userInfo.userName}</span>
                        </div> : <div className="login-userinfo"><span className="login-btn" onClick={this.showLoginMod}>登录</span></div>
                    }

                    <div className="login-time-show">
                        <Clock />
                    </div>

                    {
                        this.props.userInfo ? <div className="message-box">
                            <div className="message-item">
                                <span className="type-btn">我的发布</span>
                                <div className="hide-send">
                                    <span className="send-type" onClick={this.toMySend("talk")}>钓友圈</span>
                                    <span className="send-type" onClick={this.toMySend("tip")}>技巧</span>
                                    <i className="arrow-tar"></i>
                                </div>
                            </div>

                            <div className="message-item">
                                <span className="type-btn" onClick={this.toMyMessage}>我的消息</span>
                            </div>
                        </div> : ""
                    }

                </div>
                {
                    this.props.userInfo ? <Switch>

                        <Route path="/profile/usersend" component={UserSend}></Route>
                        <Route path="/profile/usermessage" component={UserMessage}></Route>
                    </Switch> : ""
                }

            </div>
        )
    }
}

export default connect(state => ({ userInfo: state.userReducer.userinfo }))(ProfilePageUI)
