import React, { Component } from 'react'
import { getTipDetailByTipId } from "network/tip"


import "./index.less";
export default class TipDetail extends Component {
    state = {
        tipEssayId: "",
        tipEssayData: {}
    }
    getBgAvatarStyle = (userInfo) => {
        let {
            avatarUrl,
            avatarRadX,
            avatarRadY
        } = userInfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: `${avatarRadX * 36}px`,
            backgroundPositionY: `${avatarRadY * 36}px`
        }
    }
    //挂载完时初始化工作
    componentDidMount(newProps, newState) {
        console.log("tip detail componentDidMounted", newProps, newState);
        let tipId = this.props.match.params.essayid;
        this.getTipEssayData(tipId).then((res) => {
            console.log("获取技巧帖子详情成功", res);
            this.setState({
                tipEssayId: tipId,
                tipEssayData: res.essay
            })
        })

    }

    //获取帖子详情网络请求
    getTipEssayData = (tid) => {
        return getTipDetailByTipId(tid);
    }

    //返回帖子列表
    backToLists=()=>{
        this.props.history.replace("/tip/tiplists");
    }
    render() {
        return (
            <div className="tip-essay-wrapper">
                <div className="nav-essay-leader">
                    <i className="back-btn" onClick={this.backToLists}>返回列表</i>
                    <h2 className="essay-leader-text">技巧帖子详情</h2>
                </div>
                <div className="tip-essay-top">
                    {
                        this.state.tipEssayData.userInfo && this.state.tipEssayData.userInfo.avatarUrl ?
                            <i className="avatar-init" style={this.getBgAvatarStyle(this.state.tipEssayData.userInfo)}></i> : <i className="avatar-init avatar-bg"></i>
                    }

                    <span className="essay-authorname">{this.state.tipEssayData.anglerName}</span>
                    <b className="essay-typetext">{this.state.tipEssayData.tipType}</b>
                </div>

                <div className="essay-content">
                    <h3>{this.state.tipEssayData.title}</h3>
                    <p className="essay-content-passage">{this.state.tipEssayData.content}</p>
                    {
                        this.state.tipEssayData.imgArr && this.state.tipEssayData.imgArr.length > 0 ?
                            <div className="essay-ref-img">
                                {
                                    this.state.tipEssayData.imgArr.map((item) => {
                                        return <img key={item} src={item} alt="垂钓技巧"></img>
                                    })
                                }
                            </div> : ""
                    }

                </div>

                <div className="essay-footer">
                    <em>{new Date(this.state.tipEssayData.publishTime).toLocaleDateString()}</em>
                </div>
            </div>
        )
    }
}
