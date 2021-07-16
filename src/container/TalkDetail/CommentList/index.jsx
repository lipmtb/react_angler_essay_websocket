import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getTalkCommentById, commentMainTalk, sendReplyComment } from "network/commentTalk";
import { createCommentMessage, createReplyCommentMessage } from "network/message";

import { showLoadingAction, hideLoadingAction } from "../../../redux/actions/loadingAction"
import pubsub from "pubsub-js"
import timerformatted from "jsutil/time";
import "./index.less";

class CommentList extends Component {
    state = {
        commentCount: 0,
        commentLists: [],
        hasMoreComment: true,
        canSendMain: false,
        curTmpImgArr: [],  //临时选择的图片
        sendImgArr: []   //发送到后端的图片
    }

    componentDidMount() {
        this.handleMainInput = this.jieliu(this.onInputMainComment, 1000, this);
        this.getCommentLists();
    }


    //节流函数
    jieliu = (fn, delay, that) => {
        let canRun = true;
        return () => {

            if (canRun) {
                fn.call(that);
                setTimeout(() => {

                    canRun = true;
                }, delay);
            }
            canRun = false;


        }
    }

    //显示登录框
    showLoginMod = () => {
        pubsub.publish("tologin");
    }

    //头像信息
    getBgAvatar = (userInfo) => {
        let { avatarUrl, avatarRadX, avatarRadY } = userInfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            avatarRadX: avatarRadX * 36 + "px",
            avatarRadY: avatarRadY * 36 + "px"
        }
    }
    //获取帖子评论
    getCommentLists = () => {
        return getTalkCommentById(this.props.talkId, this.state.commentCount, 4).then((res) => {
            console.log("获取评论成功", res);
            let { commentLists, commentCount } = this.state;
            if (res.length < 4) {
                this.setState({
                    hasMoreComment: false
                })
            }
            this.setState({
                commentLists: [...commentLists, ...res],
                commentCount: commentCount + res.length
            })
        })
    }

    //取消主评论选择的图片
    deleteTempImg = () => {
        this.setState({
            curTmpImgArr: [],
            sendImgArr: []
        })
    }


    //选择主评论的图片
    selectNewImg = (e) => {
        // console.log(e.currentTarget.files);
        let fileArr = e.currentTarget.files;
        let objUrlArr = [];
        for (let file of fileArr) {
            let tmpurl = document.defaultView.URL.createObjectURL(file);
            objUrlArr.push(tmpurl);
        }
        let { curTmpImgArr, sendImgArr } = this.state;

        this.setState({
            curTmpImgArr: [...curTmpImgArr, ...objUrlArr],  //临时选择的图片
            sendImgArr: [...sendImgArr, ...fileArr]   //发送到后端的图片
        })
    }

    //输入主评论
    onInputMainComment = () => {
        // console.log("主评论", this.maininput.value);
        if (this.maininput.value.trim().length > 0) {
            this.setState({
                canSendMain: true
            })
        } else {

            this.setState({
                canSendMain: false
            })
        }
        this.finallyTimer = setTimeout(() => {
            if (this.maininput.value.trim().length > 0) {
                this.setState({
                    canSendMain: true
                })
            } else {

                this.setState({
                    canSendMain: false
                })
            }
        }, 500)
    }

    //展开折叠主评论回复区域
    toggleReplyArea = (maincomment) => {
        return () => {
            let mainId = maincomment._id;
            this.setState(({ commentLists, commentCount }) => {
                return {
                    commentLists: commentLists.map((maincomm) => {
                        if (maincomm._id === mainId) {
                            maincomm.showReplyText = !maincomm.showReplyText;
                        }
                        return maincomm;
                    }),
                    commentCount: commentCount
                }
            })
        }

    }

    //显示隐藏评论回复的输入区域
    toggleReplyAreaIn = (maincomm, replycomm) => {
        return () => {
            let commentLists = this.state.commentLists;
            this.setState({
                commentLists: commentLists.map((mcomm) => {
                    if (mcomm._id === maincomm._id) {
                        mcomm.replyLists.forEach((reply) => {
                            if (reply._id === replycomm._id) {
                                reply.showSubIn = !reply.showSubIn;
                            }
                        })
                    }
                    return mcomm;
                })
            })
        }

    }

    //发送主评论
    sendMainComment = () => {
        // console.log(this.props.userInfo,this.props.talkId,this.maininput.value,this.state.sendImgArr);
        let commentMessageContent = this.maininput.value;
        this.props.showLoading("评论发送");
        commentMainTalk(this.props.userInfo, this.props.talkId, this.maininput.value, this.state.sendImgArr).then((res) => {
            console.log("主评论结果", res);
            if (res.errCode === 0) {


                this.setState(state => {
                    let { commentLists, curTmpImgArr } = state;
                    if (curTmpImgArr[0]) {

                        document.defaultView.URL.revokeObjectURL(curTmpImgArr[0]);
                    }
                    let newComment = {
                        userInfo: this.props.userInfo,
                        anglerName: this.props.userInfo.userName,
                        _id: res.commentItem._id,
                        commentText: this.maininput.value,
                        commentTime: "刚刚",
                        commentTalkId: this.props.talkId,
                        replyLists: [],
                        showReplyText: true,
                        imgArr: res.commentItem.imgArr
                    }
                    this.maininput.value = "";
                    return {
                        commentLists: [newComment, ...commentLists],
                        canSendMain: false,
                        curTmpImgArr: [],  //临时选择的图片
                        sendImgArr: []   //发送到后端的图片
                    }
                })

                if (this.props.talkEssay.anglerId === this.props.userInfo._id) {
                    return;
                }
                //发送消息通知被评论的人
                createCommentMessage(this.props.talkEssay.anglerId, this.props.talkId, this.props.userInfo._id, this.props.userInfo.userName, commentMessageContent).then((res) => {
                    // console.log("主评论发送消息通知结果", res);
                })
            }
        }).finally(() => {
            this.props.hideLoading();
        })
    }

    //回复主评论
    replyTalkMainComment = (maincomm) => {
        return (e) => {
            let inputIn = e.currentTarget.previousElementSibling;
            let cText = inputIn.value.trim();
            if(cText.length===0){
                alert("评论不能为空");
                return;
            }
            let mainCommentId = maincomm._id;//主评论_id
            this.props.showLoading("回复" + maincomm.anglerName);
            sendReplyComment(mainCommentId, this.props.userInfo.userName, maincomm.anglerName, cText).then((res) => {
                if (res.errCode === 0) {
                    //回复成功添加新回复

                    let newMainReply = {
                        _id: Math.random() + Date.now(),
                        fromUserName: this.props.userInfo.userName,
                        toUserName: maincomm.anglerName,
                        fromUserInfo: this.props.userInfo,
                        toUserInfo: maincomm.userInfo,
                        commentText: inputIn.value,
                        commentTime: '刚刚',
                        showSubIn: false,
                        mainCommentId: mainCommentId

                    }
                    let { commentLists } = this.state;
                    this.setState({
                        commentLists: commentLists.map((mcomm) => {
                            if (mcomm._id === maincomm._id) {
                                mcomm.showReplyText = true;
                                mcomm.replyLists.push(newMainReply);
                            }
                            return mcomm;
                        })
                    })

                    inputIn.value = ""
                    if (maincomm.userInfo._id === this.props.userInfo._id) {
                        return;
                    }
                    //发送消息通知被评论的人
                    createReplyCommentMessage(maincomm.userInfo._id, this.props.talkEssay._id, this.props.userInfo._id, this.props.userInfo.userName, cText, maincomm.commentText).then((res1) => {
                        // console.log("回复主评论通知结果", res1);
                    })
                }


            }).finally(() => {
                this.props.hideLoading();
            })
        }
    }

    //回复评论的回复
    sendReplyComm = (maincomm, replyitem) => {
        return (e) => {
            let inputIn = e.currentTarget.previousElementSibling;
            let cText = inputIn.value.trim();
            if(cText.length===0){
                alert("评论不能为空");
                return;
            }
            let mainCommentId = maincomm._id;//主评论_id
            this.props.showLoading("回复" + replyitem.fromUserName);
            sendReplyComment(mainCommentId, this.props.userInfo.userName, replyitem.fromUserName, cText).then((res) => {
                if (res.errCode === 0) {
                    //回复成功添加新回复

                    let newMainReply = {
                        _id: Math.random() + Date.now(),
                        fromUserName: this.props.userInfo.userName,
                        toUserName: replyitem.fromUserName,
                        fromUserInfo: this.props.userInfo,
                        toUserInfo: replyitem.fromUserInfo,
                        commentText: inputIn.value,
                        commentTime: '刚刚',
                        showSubIn: false,
                        mainCommentId: mainCommentId

                    }
                    let { commentLists } = this.state;
                    this.setState({
                        commentLists: commentLists.map((mcomm) => {
                            if (mcomm._id === maincomm._id) {

                                mcomm.replyLists.forEach((replyItem) => {
                                    if (replyitem._id === replyItem._id) {
                                        replyItem.showSubIn = false;
                                    }
                                })
                                mcomm.replyLists.push(newMainReply);
                            }
                            return mcomm;
                        })
                    })

                    inputIn.value = ""
                    if (replyitem.fromUserInfo._id === this.props.userInfo._id) {
                        return;
                    }
                    //发送消息通知被评论的人
                    createReplyCommentMessage(replyitem.fromUserInfo._id, this.props.talkEssay._id, this.props.userInfo._id, this.props.userInfo.userName, cText, replyitem.commentText).then((res1) => {
                        // console.log("回复主评论通知结果", res1);
                    })
                }


            }).finally(() => {
                this.props.hideLoading();
            })
        }

    }

    getMoreComment = () => {
        if (this.state.hasMoreComment) {
            this.props.showLoading("更多评论");
            this.getCommentLists().then(() => {

            }).finally(() => {
                this.props.hideLoading();
            })
        }

    }
    render() {
        return (
            <div className="commentLists-wrapper">
                <div className="comment-top-leader">
                    {
                        this.props.userInfo ? <div className="send-main-comm">
                            <input type="text" onChange={this.handleMainInput} ref={(node) => { this.maininput = node; }} placeholder="输入评论" />
                            <button className="sendmain-btn"
                                onClick={this.sendMainComment}
                                style={{ backgroundColor: this.state.canSendMain ? "#0f0" : "rgb(187, 245, 160)" }}
                                disabled={!this.state.canSendMain}
                            >发送</button>
                            <div className="select-img-box">
                                <input type="file" style={{ display: "none" }} onChange={this.selectNewImg} accept="image/*" id="selected-input" />
                                <label htmlFor="selected-input" className="selectimg-label">选择图片</label>
                                <div className="preview-img-show">
                                    <ul className="tmp-select-lists">
                                        {
                                            this.state.curTmpImgArr.map((img) => {
                                                return <li key={img} className="tmp-img-item">
                                                    <img src={img} alt="垂钓，鱼竿" />
                                                    <i className="iconfont icon-guanbi" onClick={this.deleteTempImg}></i>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div> : <span className="login-btn" onClick={this.showLoginMod}>登录</span>
                    }

                </div>
                {
                    // 主评论
                    this.state.commentLists.map((maincomment) => {
                        return <div className="main-comment-item" key={maincomment._id}>
                            {/* 左边头像 */}
                            <div className="avatar-left">
                                {
                                    maincomment.userInfo.avatarUrl ?
                                        <div className="avatar-init" style={this.getBgAvatar(maincomment.userInfo)}></div> :
                                        <div className="avatar-init avatar-bg"></div>
                                }
                            </div>
                            {/* 主评论内容 */}
                            <div className="right-main">
                                {/* 主评论人和内容 */}
                                <div className="main-comment-content">
                                    <span>{maincomment.anglerName}：</span>
                                    <span>{maincomment.commentText}</span>
                                    {
                                        maincomment.imgArr.length>0?
                                        <div className="comm-img-toggle">
                                            <span className="img-toggletext">评论配图</span>
                                            <img src={maincomment.imgArr[0]} alt="垂钓，鱼线" />
                                        </div>:""
                                    }

                                </div>
                                {/* 主评论时间和回复按钮 */}
                                <div className="comment-time-replybtn">
                                    <b className="main-comm-time">{timerformatted(maincomment.commentTime)}</b>
                                    <strong className="main-reply-btn" onClick={this.toggleReplyArea(maincomment)}>回复</strong>
                                    <div className="reply-input" style={{ display: maincomment.showReplyText ? "none" : "block" }}>
                                        <input type="text" placeholder={"回复@" + maincomment.anglerName} />
                                        <button className="reply-btn" onClick={this.replyTalkMainComment(maincomment)}>评论</button>
                                    </div>
                                </div>

                                {/* 主评论回复列表 */}
                                <div className="reply-lists">
                                    {
                                        maincomment.replyLists.map((replycomm) => {
                                            return <div className="reply-item" key={replycomm._id}>
                                                {
                                                    replycomm.fromUserInfo.avatarUrl ?
                                                        <div className="avatar-init" style={this.getBgAvatar(replycomm.fromUserInfo)}></div> :
                                                        <div className="avatar-init avatar-bg"></div>
                                                }
                                                <span>{replycomm.fromUserName}</span>
                                                <span className="mid-text">回复</span>
                                                {
                                                    replycomm.toUserInfo.avatarUrl ?
                                                        <div className="avatar-init" style={this.getBgAvatar(replycomm.toUserInfo)}></div> :
                                                        <div className="avatar-init avatar-bg"></div>
                                                }
                                                <span>{replycomm.toUserName}:</span>
                                                <span className="reply-comm-text">{replycomm.commentText}</span>
                                                {/* 子评论的时间和回复区域 */}
                                                <div className="comment-time-replybtn">
                                                    <b className="sub-comm-time">{timerformatted(replycomm.commentTime)}</b>
                                                    <strong className="sub-reply-btn" onClick={this.toggleReplyAreaIn(maincomment, replycomm)}>回复</strong>
                                                    <div className="sub-reply-input" style={{ display: replycomm.showSubIn ? "block" : "none" }}>
                                                        <input type="text" placeholder={"回复@" + replycomm.fromUserName} />
                                                        <button className="sub-reply-btn" onClick={this.sendReplyComm(maincomment, replycomm)}>评论</button>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>

                        </div>
                    })
                }

                {
                    this.state.hasMoreComment ? <div className="more-comm-section" onClick={this.getMoreComment}>
                        <span className="show-more-comm">更多</span>

                        <span className="arrow-more"></span>
                        <span className="arrow-more"></span>
                        <span className="arrow-more"></span>
                    </div> : <div className="more-comm-section">
                        <span className="reachend-comm">~到底了~</span>

                    </div>
                }


            </div>
        )
    }
}


export default connect(state => ({ userInfo: state.userReducer.userinfo }), {
    showLoading: showLoadingAction,
    hideLoading: hideLoadingAction
})(CommentList)