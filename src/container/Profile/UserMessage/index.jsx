import React, { Component } from 'react'
import { connect } from 'react-redux'
import {getUserMsgLists} from "network/message";
import MessageItem from './Message';

import "./index.less"
 class UserMsessageUI extends Component {
     state={
         messageLists:[],
         messageCount:0
     }
     componentDidMount(){
         //获取用户消息列表
        this.getUserMessageLists(this.state.messageCount,4).then((res)=>{
            if(res.errCode===0){
                console.log("获取用户消息列表成功",res.messageLists);
                let {messageLists,messageCount}=this.state;
                this.setState({
                    messageLists:[...messageLists,...res.messageLists],
                    messageCount:messageCount+res.messageLists.length
                })
            }
        }).catch((err)=>{
            console.log("获取用户消息列表失败",err);
        })
     }

     //获取用户消息，skip,limit参数默认4
     getUserMessageLists=(skip,limit=4)=>{
        return getUserMsgLists(this.props.userId,skip,limit);
     }


    render() {
        return (
            <div className="user-message-wrapper">
                    <h3>我的消息</h3>
                   <div className="user-message-show">
                        {
                            this.state.messageLists.map((messageData)=>{
                                return <MessageItem key={messageData._id} messageData={messageData} />
                            })
                        }
                   </div>
            </div>
        )
    }
}

export default connect(state=>({userId:state.userReducer.userinfo._id}))(UserMsessageUI);
