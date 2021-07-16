import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserMsgLists, userReadEssayMsg } from "network/message";
import { decreateMsgCount } from "../../../redux/actions/messageAction"
import { showLoadingAction,hideLoadingAction } from "../../../redux/actions/loadingAction"
import MessageItem from './Message';
import io from "socket.io-client";
import serverUrl from "network/server";
import "./index.less"
class UserMsessageUI extends Component {
    state = {
        messageLists: [],
        messageCount: 0,
        hasMoreMsg:true
    }
    componentWillUnmount() {
        this.websocketIo.disconnect();
    }
    componentDidMount() {
        this.websocketIo = io.connect(serverUrl);
        this.websocketIo.on(this.props.userinfo._id + "newMsg", this.socketNewMessage);
        this.websocketIo.on(this.props.userinfo._id + "updateMsg", this.socketUpdateMsg);
        //获取用户消息列表
        this.getUserMessageLists(this.state.messageCount, 4).then((res) => {
            if (res.errCode === 0) {
                console.log("获取用户消息列表成功", res.messageLists);
                if(res.messageLists.length<4){
                    this.setState({
                        hasMoreMsg:false
                    })
                }
                let { messageLists, messageCount } = this.state;
                this.setState({
                    messageLists: [...messageLists, ...res.messageLists],
                    messageCount: messageCount + res.messageLists.length
                })
            }
        }).catch((err) => {
            console.log("获取用户消息列表失败", err);
        })
    }


    //服务端推来新消息
    socketNewMessage = (newMessage) => {

        this.responseMessageFormatted(newMessage);
        console.log("新消息", newMessage);
        let { messageLists, messageCount } = this.state;
        this.setState({
            messageLists: [newMessage, ...messageLists],
            messageCount: messageCount + 1
        })

    }
    responseMessageFormatted(message) {
        if (message.essayInfo.imgArr.length > 0) {
            for (let i = 0; i < message.essayInfo.imgArr.length; i++) {
                message.essayInfo.imgArr[i] = serverUrl + "/images/talk/" + message.essayInfo.imgArr[i];
            }
        }
        if (message.messageArr.length > 0) {
            for (let commentMessage of message.messageArr) {
                if (commentMessage.fromUserInfo.avatarUrl) {
                    commentMessage.fromUserInfo.avatarUrl = serverUrl + "/images/avatar/" + commentMessage.fromUserInfo.avatarUrl;
                }
                commentMessage.createTime = "刚刚";
            }
        }
    }


    //服务端更新某个会话的新消息
    socketUpdateMsg = (msg) => {
        console.log("更新某个会话消息", msg);
        msg.createTime = "刚刚";
        msg._id = Date.now() + (Math.random() + "").substr(2, 6);
        if (msg.fromUserInfo.avatarUrl) {
            msg.fromUserInfo.avatarUrl = serverUrl + "/images/avatar/" + msg.fromUserInfo.avatarUrl;

        }
        let oldLists = this.state.messageLists;
        this.setState({
            messageLists: oldLists.map((message) => {
                if (message.essayId === msg.essayId) {
                    message.messageArr = [msg, ...message.messageArr];
                    message.messageCount = message.messageCount + 1;
                }
                return message;
            })
        })
    }

    //获取用户消息，skip,limit参数默认4
    getUserMessageLists = (skip, limit = 4) => {
        return getUserMsgLists(this.props.userinfo._id, skip, limit);
    }
    navToTalkDetail = (talkId) => {
        // console.log("跳到某个帖子",talkId);
        this.props.history.push("/talkDetail/" + talkId);
    }

    //用户展开读取消息
    readEssayMsg = (msg) => {
        let { messageLists } = this.state;
        this.props.readMsgAction(msg.messageCount);//redux更新消息总数
        userReadEssayMsg(msg.userId, msg.essayId, msg.messageCount).then((res) => {
            // console.log("后端返回，某个会话消息数清0",res)
        })

        this.setState({
            messageLists: messageLists.map((item) => {
                if (item._id === msg._id) {
                    item.messageCount = 0;
                }
                return item;
            })
        })
    }

    //显示更多消息
    showMoreMsg=()=>{
        if(this.state.hasMoreMsg){
            this.props.showLoadingAction("更多消息");
            this.getUserMessageLists(this.state.messageCount,4).then((res)=>{
                if (res.errCode === 0) {
                    console.log("获取更多用户消息列表成功", res.messageLists);
                    if(res.messageLists.length<4){
                        this.setState({
                            hasMoreMsg:false
                        })
                    }
                    let { messageLists, messageCount } = this.state;
                    this.setState({
                        messageLists: [...messageLists, ...res.messageLists],
                        messageCount: messageCount + res.messageLists.length
                    })
                }
            }).finally(()=>{
                this.props.hideLoadingAction();
            })
        }
    }
    render() {
        return (
            <div className="user-message-wrapper">
                <h3>我的消息</h3>
                <div className="user-message-show">
                    {
                        this.state.messageLists.map((messageData) => {
                            return <MessageItem key={messageData._id} readMsg={this.readEssayMsg} talkDetailPage={this.navToTalkDetail} messageData={messageData} />
                        })
                    }

                    <div className="more-message">
                        {
                            this.state.hasMoreMsg?  <span className="more-msg-btn" onClick={this.showMoreMsg}>更多消息</span>:
                            <span className="reach-bottom-text">到底了</span>
                        }
                      
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({ userinfo: state.userReducer.userinfo }), {
    readMsgAction: decreateMsgCount,
    showLoadingAction,
    hideLoadingAction
})(UserMsessageUI);
