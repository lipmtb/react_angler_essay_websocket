import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getMyTalkSend } from "network/talk"
import { getMySendTip } from "network/tip"
import TalkLists from './TalkLists'
import TipLists from './TipLists'

import {showLoadingAction,hideLoadingAction} from "../../../redux/actions/loadingAction"
import "./index.less";

class UserSend extends Component {
    state = {
        userId: "",
        curType: "",
        sendTalk: {
            lists: [],
            count: 0,
            hasMore: true
        },
        sendTip: {
            lists: [],
            count: 0,
            hasMore: true
        }
    }

    //路由更新location.state的参数
    static getDerivedStateFromProps(newProps, newState) {
        newState.curType = newProps.location.state.sendType;//路由state传递参数

        return newState;
    }

    componentDidMount() {
        this.canLoadingMore=true;
        this.setState({
            userId: this.props.userInfo._id
        })

        this.getSendTalkLists();
        this.getSendTipLists();
        document.defaultView.addEventListener("scroll",this.onMyPageScroll);
    }

    componentWillUnmount(){
        document.defaultView.removeEventListener("scroll",this.onMyPageScroll);
    }

    onMyPageScroll=(e)=>{
        let allHeight=document.documentElement.offsetHeight;
        let notScrollheight=document.documentElement.clientHeight;
        if(allHeight-notScrollheight<=e.currentTarget.scrollY&&this.canLoadingMore){
            // console.log("触底",this);
      
           
            if(this.state.curType==='talk'&&this.state.sendTalk.hasMore){
                this.props.showLoadingAction("更多talk");
                this.canLoadingMore=false;
                this.getSendTalkLists().then(()=>{
                    
                }).finally(()=>{
                    this.props.hideLoadingAction();
                    this.canLoadingMore=true;
                });
            }else if(this.state.curType==='tip'&&this.state.sendTip.hasMore){
                this.props.showLoadingAction("更多tip");
                this.canLoadingMore=false;
                this.getSendTipLists().then(()=>{
                   
                }).finally(()=>{
                    this.props.hideLoadingAction();
                    this.canLoadingMore=true;
                })
            }
        }
    }

    //获取我发布的钓友圈帖子
    getSendTalkLists() {
        return getMyTalkSend(this.props.userInfo._id, this.state.sendTalk.count).then((res) => {
            console.log("获取我发布的talk", res.sendTalk);
            let { sendTalk } = this.state;
            if(res.sendTalk.length<4){
                this.setState({
                    sendTalk: {
                        lists: [...sendTalk.lists, ...res.sendTalk],
                        count: sendTalk.count + res.sendTalk.length,
                        hasMore:false
                    }
                })
                return;
            }
            this.setState({
                sendTalk: {
                    lists: [...sendTalk.lists, ...res.sendTalk],
                    count: sendTalk.count + res.sendTalk.length,
                    hasMore:true
                }
            })
        })
    }

    //获取我发布的技巧帖子
    getSendTipLists() {
        return getMySendTip(this.props.userInfo._id, this.state.sendTip.count).then((res) => {

            console.log("获取我发布的tip", res.sendTip);
            let { sendTip } = this.state;
            if(res.sendTip.length<4){
                this.setState({
                    sendTip: {
                        lists: [...sendTip.lists, ...res.sendTip],
                        count: sendTip.count + res.sendTip.length,
                        hasMore:false
                    }
                })
                return;
            }
            this.setState({
                sendTip: {
                    lists: [...sendTip.lists, ...res.sendTip],
                    count: sendTip.count + res.sendTip.length,
                    hasMore:true
                }
            })
        })
    }
    render() {

        return (
            <div className="user-send-wrapper">
                <div className="tab-select">
                    {
                        this.state.curType === 'talk' ? <h3>钓友圈</h3> : <h3>技巧</h3>
                    }

                    <div style={{ display: this.state.curType === 'talk' ? "block" : "none" }}>
                     <TalkLists lists={this.state.sendTalk.lists} />
                    </div>


                    <div style={{ display: this.state.curType === 'tip' ? "block" : "none" }}>
                      <TipLists lists={this.state.sendTip.lists}/>
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(state => ({ userInfo: state.userReducer.userinfo }),{
    showLoadingAction,hideLoadingAction
})(UserSend);
