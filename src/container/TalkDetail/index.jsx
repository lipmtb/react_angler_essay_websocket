import React, { Component } from 'react'
import { connect } from 'react-redux';

import { getTalkEssayById } from "network/talk";

import TalkImgRun from './TalkImgRun';
import EssayLeaderText from "./EssayLeaderText"
import CommentList from "./CommentList"
import "./index.less";
class TalkDetail extends Component {
    state = {
        talkId: "",  //帖子id
        talkEssay: null,
        curActiveIdx: 0, //显示的哪个大图
        isShowBig: false,  //显示和隐藏大图轮播
     
    }


    componentDidMount() {

       
        this.setState({
            talkId: this.props.match.params.talkId
        }, () => {
            console.log("talkdetail talkid", this.state.talkId);

        })

        this.getTalkEssayById().then((res) => {
            console.log("获取帖子详情成功", res);
            this.setState({
                talkEssay: res.talkdata
            })
        })
    }

    //头像信息
    getBgStyle = (userinfo) => {
        let { avatarUrl, avatarRadX, avatarRadY } = userinfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: 36 * avatarRadX + "px",
            backgroundPositionY: 36 * avatarRadY + "px",

        }
    }
    //格式化时间
    getpubTime = (datestr) => {
        let date = new Date(datestr);
        return date.toLocaleDateString();
    }
    //获取帖子详情
    getTalkEssayById = () => {
        return getTalkEssayById(this.props.match.params.talkId);
    }

    //返回上一页面
    backTopLastPage = () => {
        this.props.history.goBack();
    }
    showBigImg = (idx) => {
        return () => {
            this.setState({
                curActiveIdx: idx,
                isShowBig: true
            })
        }
    }
    hideBigImg = () => {
        this.setState({
            isShowBig: false
        })
    }
    //小圆点切换
    changeViewImg = (idx) => {


        return () => {
            // console.log("changeIdx", this.state.curActiveIdx);
            let oldIdx = this.state.curActiveIdx;
            let count = 0;
            while (oldIdx + 1 <= idx) {

                setTimeout(((idx) => {
                    return () => {
                        this.setState({
                            curActiveIdx: idx + 1
                        })
                    }

                })(oldIdx), 200 * count)

                oldIdx++;
                count++;
            }

            while (oldIdx - 1 >= idx) {

                setTimeout(((idx) => {
                    return () => {
                        this.setState({
                            curActiveIdx: idx - 1
                        })
                    }

                })(oldIdx), 200 * count)

                oldIdx--;
                count++;
            }

        }
    }

    //滑动时改变
    changeCurIdx = (i) => {
        // console.log("changeCurIdx");
        this.setState({
            curActiveIdx: i
        })
    }


    render() {
        return (
            <div className="talk-detail-wrapper">
                <div className="talk-detail-top">
                    <span className="back-btn-top" onClick={this.backTopLastPage}>返回</span>
                    <EssayLeaderText />
                </div>


                {/* 帖子主要内容 */}
                {
                    this.state.talkEssay ?
                        <div className="talk-essay-wrapper">
                            {/* 帖子作者和发布时间 */}
                            <div className="essay-authorinfo">
                                {
                                    this.state.talkEssay.userInfo.avatarUrl ?
                                        <i className="avatar-init" style={this.getBgStyle(this.state.talkEssay.userInfo)}></i> :
                                        <i className="avatar-init avatar-bg"></i>
                                }
                                <span className="author-nametext">{this.state.talkEssay.anglerName}</span>
                                <em className="pubtimestr">发布于：{this.getpubTime(this.state.talkEssay.publishTime)}</em>
                            </div>
                            {/* 标题 */}
                            <p className="essay-title">{this.state.talkEssay.title}</p>

                            <p className="essay-content">{this.state.talkEssay.content}</p>

                            <div className="essay-img">
                                {/* 小图 */}
                                <div className="small-img">
                                    {
                                        this.state.talkEssay.imgArr.map((img, idx) => {
                                            return <img className="smallimgitem" onClick={this.showBigImg(idx)} src={img} key={img} alt="垂钓，帖子" />
                                        })

                                    }

                                </div>
                                {/* 大图轮播 */}
                                <div className="bigger-img" style={{ display: this.state.isShowBig ? "block" : "none" }}>

                                    <TalkImgRun changeResizeIdx={this.changeCurIdx} imgLists={this.state.talkEssay.imgArr} curIdx={this.state.curActiveIdx} />
                                    {/* 关闭轮播图 */}
                                    <i className="iconfont icon-guanbi" onClick={this.hideBigImg}></i>
                                    <ul className="circle-lists">
                                        {/* 小圆点 */}
                                        {
                                            this.state.talkEssay.imgArr.map((item, idx) => {
                                                return <li className="circle-item" key={item} onClick={this.changeViewImg(idx)} style={{ backgroundColor: idx === this.state.curActiveIdx ? "#008c8c" : "rgba(221, 221, 221, 0.651)" }}></li>
                                            })
                                        }
                                    </ul>
                                </div>


                            </div>
                        </div> : ""
                }


                {/* 帖子评论 */}
                <div className="talk-comment-wrapper">
                   
                    {/* 全部评论 */}
                    <CommentList talkId={this.props.match.params.talkId} talkEssay={this.state.talkEssay}/>
                </div>

            </div>
        )
    }
}


export default connect(state => ({ userInfo: state.userReducer.userinfo }))(TalkDetail);