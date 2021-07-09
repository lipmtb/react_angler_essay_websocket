import React, { Component } from 'react'
import "./index.less"
export default class MessageItem extends Component {
    state={
        isShowCommlists:false
    }
    getBgAvatar=(userinfo)=>{
        let {avatarUrl,avatarRadX,avatarRadY}=userinfo;
        return {
            backgroundImage:`url(${avatarUrl})`,
            avatarRadX:avatarRadX*36+"px",
            avatarRadY:avatarRadY*36+"px"
        }
    }
    closeCommlists=()=>{
        this.setState({
            isShowCommlists:false
        })
    }
    showCommlists=()=>{
        this.setState({
            isShowCommlists:true
        })
    }
    render() {
        return (
            <div className="message-item">
                <div className="mesage-top">
                    {/* 消息来源和新消息数 */}
                    <span className="prev-text">来自钓友圈：</span>
                    <span className="essay-title">{this.props.messageData.essayInfo.title}</span>
                    <span className="message-count" style={{display:this.props.messageData.messageCount>0?"inline":"none"}}>{this.props.messageData.messageCount}条评论消息</span>
                </div>
                
                <div className="toggle-btn">
                    {
                        this.state.isShowCommlists?
                        <span onClick={this.closeCommlists}>折叠</span>:
                        <span onClick={this.showCommlists}>展开</span>
                        
                    }
                
                </div>
                {/* 消息列表 */}
                <div className="comment-message-lists">
                    {
                         this.props.messageData.messageArr.map((commentmessage)=>{
                            return  <div className="comment-message-item" key={commentmessage._id}>
                                {
                                    commentmessage.fromUserInfo.avatarUrl? <i className="avatar-init" style={this.getBgAvatar(commentmessage.fromUserInfo)}></i>: 
                                    <i className="avatar-init avatar-bg"></i>
                                }
                               
                                <span className="comm-username">{commentmessage.fromUserName}</span>
                                <span className="pre-commconten">评论:</span>
                                <span className="mes-conten">{commentmessage.messageContent}</span>
                                <span className="comm-time">{commentmessage.createTime}</span>
                            </div>
                         })
                    }
                  
                </div>
               
            </div>
        )
    }
}
