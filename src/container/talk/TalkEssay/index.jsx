import React, { Component } from 'react'
import { connect } from 'react-redux';
import pubsub from "pubsub-js";
import { showLoadingAction, hideLoadingAction } from "../../../redux/actions/loadingAction"

import { getTalkCommentById, commentMainTalk, sendReplyComment } from "network/commentTalk";
import { createCommentMessage } from "network/message";
import {getTalkCommentCount} from "network/talk";
import "./index.less";
class TalkEssay extends Component {
    state = {
        showBigImg: false,//大图展示和隐藏
        curBigIdx: 0,  //展示的某个大图
        showComment: false, //是否展示输入评论和评论列表区域
        commentLists: [], //当前评论的列表
        totalCommentCount:0,
        commentPage: 0,  //当前加载评论的页码
        canSendComment: false,//评论是否能发送
        showCommImg: false,  //是否展示评论输入的图片
        willSendFile: null, //评论选择的图片(上传到后端)
        tmpFile: "", //临时展示的图片objectUrl（显示在界面上预览）
        largerPadding:false
    }
    showLoginMod = () => {
        pubsub.publish("tologin");
    }
    //展示大图
    showHideImg = (idx) => {
        return () => {
            this.setState({
                showBigImg: true,
                curBigIdx: idx
            })
        }
    }

    //隐藏大图
    hideBigImg = () => {
        this.setState({
            showBigImg: false
        })
    }

    //展示左边大图
    showLeftImg = () => {
        this.setState(state => {
            let { curBigIdx } = state;
            return {
                curBigIdx: curBigIdx - 1
            }
        })
    }
    //展示右边大图
    showRightImg = () => {
        this.setState(state => {
            let { curBigIdx } = state;
            return {
                curBigIdx: curBigIdx + 1
            }
        })
    }
    //帖子发布者头像信息
    getBgStyle = () => {
        let {
            avatarUrl,
            avatarRadX,
            avatarRadY
        } = this.props.talkdata.userInfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: `${avatarRadX * 36}px`,
            backgroundPositionY: `${avatarRadY * 36}px`,

        }
    }
    //评论头像信息
    getCommentAvatar = (userInfo) => {
        let {
            avatarUrl,
            avatarRadX,
            avatarRadY
        } = userInfo;
        return {
            backgroundImage: `url(${avatarUrl})`,
            backgroundPositionX: `${avatarRadX * 36}px`,
            backgroundPositionY: `${avatarRadY * 36}px`,

        }
    }

    //收起或者展开评论
    toggleCommentShow = () => {
        this.setState(state => {
            let { showComment } = state;
            return {
                showComment: !showComment
            }
        })
    }

    //挂载完立刻获取总评论数，第一页的评论
    componentDidMount() {
        //总评论数
        getTalkCommentCount(this.props.talkdata._id).then((res)=>{
            // console.log("总评论数",res);
            this.setState({
                totalCommentCount:res.total
            })
        })
        this.getCommentByPage(0).then((newCommentLists) => {
            // console.log("获取评论", this.state.commentPage, ":", newCommentLists);
            this.setState({
                commentLists: newCommentLists
            })
        });
    }
    //获取某页评论
    getCommentByPage = (page) => {
        return getTalkCommentById(this.props.talkdata._id, page);
    }

    //评论输入
    onInputCommText = (e) => {
        let tar = e.currentTarget;
        clearTimeout(this.inputComm);
        this.inputComm = setTimeout(() => {
            let commentText = tar.value.trim();
            if (commentText.length > 0) {
                this.setState({
                    canSendComment: true
                })
            } else {
                this.setState({
                    canSendComment: false
                })
            }
        }, 500)

    }

    //是否展示评论输入图片
    showAddingBox = () => {
        this.setState({
            showCommImg: true
        })
    }
    hideAddingBox = () => {
        this.setState({
            showCommImg: false
        })
    }

    //评论选择图片
    handleAddingCommentImg = (e) => {
        let files = e.currentTarget.files;
        console.log("上传的图片", files);
        let tmpUrl = document.defaultView.URL.createObjectURL(files[0]);
        this.setState({
            willSendFile: files[0], //评论选择的图片(上传到后端)
            tmpFile: tmpUrl
        })
    }
    //取消选择的图片
    deleteCurSelected = () => {
        this.setState(state => {
            let { tmpFile } = state;
            document.defaultView.URL.revokeObjectURL(tmpFile);
            return {
                willSendFile: null, //评论选择的图片(上传到后端)
                tmpFile: ""
            }

        })
    }
    //发送主评论
    sendNewMainComment = () => {
        let commentMessageContent= this.commIn.value;
        console.log("发布主评论", this.props.userInfo, this.props.talkdata._id, this.commIn.value, this.state.willSendFile);
        this.props.showLoading("提交评论");
        commentMainTalk(this.props.userInfo, this.props.talkdata._id, this.commIn.value, this.state.willSendFile).then((res) => {
            console.log("主评论返回结果", res);
            if (res.errCode === 0) {


                this.setState(state => {
                    let { commentLists, tmpFile } = state;
                    if (tmpFile) {

                        document.defaultView.URL.revokeObjectURL(tmpFile);
                    }
                    let newComment = {
                        userInfo: this.props.userInfo,
                        anglerName: this.props.userInfo.userName,
                        _id: res.commentItem._id,
                        commentText: this.commIn.value,
                        commentTime: "刚刚",
                        commentTalkId: this.props.talkdata._id,
                        replyLists: [],
                        showReplyText: true,
                        imgArr: res.commentItem.imgArr
                    }
                    this.commIn.value = "";
                    return {
                        canSendComment: false,//评论是否能发送
                        showCommImg: false,  //是否展示评论输入的图片
                        willSendFile: null, //评论选择的图片(上传到后端)
                        tmpFile: "",  //临时展示的图片objectUrl（显示在界面上预览）
                        commentLists: [newComment, ...commentLists]
                    }
                })

                //发送消息通知被评论的人
                createCommentMessage(this.props.talkdata.anglerId,this.props.talkdata._id,this.props.userInfo._id,this.props.userInfo.userName,commentMessageContent).then((res)=>{
                    console.log("主评论发送消息通知结果",res);
                })
            }
        }).finally(() => {
            this.props.hideLoading();
        })
    }

    //上一页评论
    showLastComment = () => {
        let { commentPage } = this.state;
        this.getCommentByPage(commentPage - 1).then((newlists) => {
            console.log("获取评论", commentPage - 1, ":", newlists);
            this.setState({
                commentLists: newlists,
                commentPage: commentPage - 1
            })
        })
    }

    //下一页评论
    showNextComment = () => {
        let { commentPage } = this.state;
        this.getCommentByPage(commentPage + 1).then((newlists) => {
            console.log("获取评论", commentPage + 1, ":", newlists);
            this.setState({
                commentLists: newlists,
                commentPage: commentPage + 1
            })
        })
    }

    //修改某条评论的属性，图片的宽度
    onCommImgLoad = (idx) => {
        return (e) => {
            // console.log(comm.imgArr[0],"图片"+idx+"onload:",e.currentTarget.width);
            let imgWidth = e.currentTarget.width;
            let imgHeight = e.currentTarget.height;
            let { commentLists } = this.state;
            this.setState({
                commentLists: commentLists.map((item, i) => {
                    if (i === idx) {
                        let newItem = Object.assign({}, item);
                        newItem.commImgWidth = imgWidth;
                        newItem.commImgHeight = imgHeight;
                        return newItem;
                    } else {
                        return item;
                    }
                })
            })
        }
    }

    //toggleReplyBox :展开和折叠回复,axios response添加了showReplyText属性！！
    toggleReplyBox = (idx) => {
        return () => {
            let { commentLists } = this.state;
            this.setState({
                commentLists: commentLists.map((item, i) => {
                    let { showReplyText } = item;
                    if (i === idx) {
                        let newItem = Object.assign({}, item);
                        newItem.showReplyText = !showReplyText;
                        return newItem;
                    } else {
                        return item;
                    }
                })

            })
        }

    }

    //回复某条主评论
    onReplyComment = (comm) => {
        return (e) => {
            let cintput=e.currentTarget.previousElementSibling;
            let cText= cintput.value;
            this.props.showLoading("回复"+comm.anglerName);
            // console.log("回复",comm._id,this.props.userInfo.userName,comm.anglerName,e.currentTarget.previousElementSibling.value);
            sendReplyComment(comm._id, this.props.userInfo.userName, comm.anglerName,cText).then((res) => {
                console.log("回复主评论结果", res);
                if(res.errCode===0){
                    //回复成功添加新回复
                    cintput.value="";
                    let newMainReply={
                        _id:Math.random()+Date.now(),
                        fromUserName:this.props.userInfo.userName,
                        toUserName:comm.anglerName,
                        fromUserInfo:this.props.userInfo,
                        toUserInfo:comm.userInfo,
                        commentText:cText,
                        commentTime:'刚刚',
                        showSubIn:false,
                        mainCommentId:comm._id

                    }
                    let {commentLists}=this.state;
                    this.setState({
                        commentLists:commentLists.map((maincomment)=>{
                            if(maincomment._id===comm._id){
                                maincomment.replyLists.push(newMainReply);
                            }
                            return maincomment;
                        })
                    })
                }
            }).finally(()=>{
                this.props.hideLoading();
            })
        }
    }

    //展开折叠某条子评论的回复
    onToggleSubReply = (comm,replyItem) => {
        return ()=>{
            // console.log("回复子评论************");
            let {commentLists}=this.state;
          this.setState({
            commentLists:commentLists.map((maincomm)=>{
                if(comm._id===maincomm._id){
                    let {replyLists}=maincomm;
                    for(let reply of replyLists){
                      
                        if(reply._id===replyItem._id){
                            reply.showSubIn=!reply.showSubIn;
                            continue;
                        }
                        reply.showSubIn=false;
                    }
                    // let newMainComm=Object.assign({},maincomm);
                    // newMainComm.replyLists=[...replyLists];
                    // return newMainComm;
                    return maincomm;
                }else{
                    return maincomm;
                }
            })
          })
        }
      
    }

    //发送子评论的回复
    onReplySubComment=(comm,replyitem)=>{
        
        return (e)=>{
            let subinput=e.currentTarget.previousElementSibling;
            let originValue=subinput.value;
            let commentId=comm._id;
            this.props.showLoading("回复"+ replyitem.fromUserName);
            sendReplyComment(comm._id, this.props.userInfo.userName, replyitem.fromUserName, originValue).then((res) => {
                console.log("回复子评论回复结果", res);
                if(res.errCode===0){
                    //回复成功添加新回复
                    subinput.value="";//清空输入框
                    let newSubReply={
                        _id:Math.random()+Date.now(),
                        fromUserName:this.props.userInfo.userName,
                        toUserName:replyitem.fromUserName,
                        fromUserInfo:this.props.userInfo,
                        toUserInfo:replyitem.fromUserInfo,
                        commentText:originValue,
                        commentTime:'刚刚',
                        showSubIn:false,
                        mainCommentId:comm._id

                    }
                    this.setState(state=>{
                        let {commentLists}=state;
                        for(let citem of commentLists){
                            if(citem._id===commentId){
                                citem.replyLists=[...citem.replyLists,newSubReply];
                                for(let subreply of citem.replyLists){
                                    subreply.showSubIn=false;
                                }
                            }
                        }
                        console.log("update new reply************");
                        return Object.assign(state,{commentLists:[...commentLists]});
                    })

                }
            }).finally(()=>{
                this.props.hideLoading();
            })
        }
    }

    //调整评论区大小
    resizeAllCommentFields=()=>{
        this.setState({
            largerPadding:true
        })
    }
    resetAllCommentFields=()=>{
        this.setState({
            largerPadding:false
        })
    }
    render() {
        return (
            <div className="talk-essay-wrapper">

                <div className="essaytop-info">
                    <div className="userinfo-left">
                        {
                            this.props.talkdata.userInfo.avatarUrl ?
                                <div className="avatar-init" style={this.getBgStyle()}></div> :
                                <div className="avatar-init avatar-bg"></div>

                        }
                    </div>


                    <span className="user-nameshow">{this.props.talkdata.anglerName}</span>
                    <b className="essay-timerstr">{this.props.talkdata.publishTime}</b>
                </div>
                <div className="essay-title">
                    <h3 className="essay-title-h3">{this.props.talkdata.title}</h3>
                </div>

                <div className="essay-content">
                    <p className="essay-passage">{this.props.talkdata.content}</p>
                </div>

                <div className="img-show" style={{ display: !this.state.showBigImg ? "block" : "none" }}>
                    {
                        this.props.talkdata.imgArr.map((imgitem, idx) => {
                            return <img key={idx} src={imgitem} alt="垂钓" onClick={this.showHideImg(idx)} />
                        })
                    }

                </div>
                <div className="img-bigger" style={{ display: this.state.showBigImg ? "block" : "none" }}>
                    {
                        this.props.talkdata.imgArr.map((imgitem, idx) => {
                            return <img key={idx} src={imgitem} alt="垂钓bigger" style={{ display: this.state.curBigIdx === idx ? "block" : "none" }} onClick={this.hideBigImg} />
                        })
                    }

                    <div className="direction left-arrow" onClick={this.showLeftImg} style={{ display: this.state.curBigIdx ? "block" : "none" }}></div>
                    <div className="direction right-arrow" onClick={this.showRightImg} style={{ display: this.state.curBigIdx === this.props.talkdata.imgArr.length - 1 ? "none" : "block" }}></div>
                </div>

                <div className="comment-toggle" onClick={this.toggleCommentShow}>
                    {
                        this.state.showComment ? <span className="comment-toggle-btn">
                            收起</span> : <span className="comment-toggle-btn">
                            <i className="iconfont icon-pinglun"></i>
                            <em>{this.state.totalCommentCount}</em>
                        </span>
                    }
                </div>

                <div className="all-comment-fields" style={{ opacity: this.state.showComment ? 1 : 0, padding: this.state.showComment ? this.state.largerPadding?'4em 0.6em':'1em 0.6em' : "0", height: this.state.showComment ? "auto" : '0' }}>
                    {/* 自己发布评论区域 */}
                    <div className="no-login" style={{ display: this.props.isLogin ? 'none' : "block" }}>
                        <button onClick={this.showLoginMod} className="login-showbtn">登录发评论</button>
                    </div>
                    <div className="my-comment" style={{ display: this.props.isLogin ? 'block' : "none" }}>
                        <div className="my-top">
                            <div className="userinfo-left">
                                {
                                    this.props.talkdata.userInfo.avatarUrl ?
                                        <div className="avatar-init" style={this.getBgStyle()}></div> :
                                        <div className="avatar-init avatar-bg"></div>

                                }
                            </div>
                            <input type="text" className="inputcommtext" placeholder="输入评论" onInput={this.onInputCommText} ref={(node) => this.commIn = node} />
                            <button className="send-comment-btn" onClick={this.sendNewMainComment} disabled={!this.state.canSendComment} style={{ backgroundColor: this.state.canSendComment ? "#008c8c" : "#a8a8a8", cursor: this.state.canSendComment ? "pointer" : "not-allowed" }}>发送</button>
                        </div>
                        {/* 评论附加功能--添加评论图片 */}
                        <div className="my-select">
                            <i className="iconfont icon-tupian"></i>
                            <span className="add-com-img" onClick={this.showAddingBox}>添加图片</span>
                            <div className="img-hidebox" style={{ display: this.state.showCommImg ? 'block' : 'none' }}>
                                <i className="iconfont icon-guanbi" onClick={this.hideAddingBox}></i>
                                {
                                    this.state.tmpFile ? <div className="img-add-sel img-show-prev">
                                        <img src={this.state.tmpFile} alt="评论带图" className="img-comm" />
                                        <i className="iconfont icon-guanbi" onClick={this.deleteCurSelected}></i>
                                    </div> : <div className="img-add-sel">
                                        <input type="file" id="addingcommimg" accept="image/*" style={{ display: "none" }} onChange={this.handleAddingCommentImg} />

                                        <label htmlFor="addingcommimg">添加图片</label>
                                    </div>
                                }


                            </div>
                        </div>

                    </div>
                    {/* 其他用户评论列表 */}
                    <div className="comment-leader-top">

                        <b>全部评论：{this.state.totalCommentCount}</b>
                    </div>
                    {/* 主评论列表 */}
                    <div className="comment-lists">
                        {
                            this.state.commentLists.map((comm, idx) => {
                                // 主评论头像
                                return <div key={comm._id} className="comment-item">
                                    <div className="user-avatar">
                                        {
                                            comm.userInfo.avatarUrl ?
                                                <div className="avatar-init" style={this.getCommentAvatar(comm.userInfo)}></div> :
                                                <div className="avatar-init avatar-bg"></div>

                                        }
                                    </div>
                                    {/* 主评论内容 */}
                                    <div className="comm-main">
                                        <div className="comm-user-content">
                                            <span>{comm.anglerName}</span>
                                            <span> : {comm.commentText}</span>
                                            <div className="comm-img-toggle"  style={{ display: (comm.imgArr && comm.imgArr.length) ? 'inline-block' : 'none', marginLeft: "1em", color: "#ccc", fontSize: '0.6em', cursor: "pointer" }}>
                                                评论配图
                                                {(comm.imgArr && comm.imgArr.length) ? <img src={comm.imgArr[0]} onLoad={this.onCommImgLoad(idx)} 
                                                alt="评论图片"  onMouseEnter={this.resizeAllCommentFields} onMouseLeave={this.resetAllCommentFields}
                                                style={{
                                                    left: comm.commImgWidth ? (25 - comm.commImgWidth / 2) + "px" : "0",
                                                    top: (comm.commImgHeight > 80 && idx >= 2) ? (-1 * comm.commImgHeight + 2) + "px" : "22px"
                                                }} /> : ""}
                                                {(comm.imgArr && comm.imgArr.length) ? <i className="comm-img-top" ></i> : ""}
                                            </div>

                                        </div>
                                        {/* 展开折叠回复 */}
                                        <div className="show-reply">
                                            <span className="reply-toggle-btn" onClick={this.toggleReplyBox(idx)}>{comm.showReplyText ? "展开" : "折叠"}</span>
                                            <span className="comm-time">{comm.commentTime}</span>
                                        </div>

                                        <div className="reply-lists-wrapper" style={{ height: comm.showReplyText ? "0" : "auto", padding: comm.showReplyText ? "0" : "0.4em" }}>
                                            <div className="reply-in">
                                                <input type="text" name="reply-intext" placeholder={"回复" + comm.anglerName} />
                                                {
                                                    this.props.isLogin?
                                                <button className="reply-btn" onClick={this.onReplyComment(comm)}>回复</button>:
                                                <button className="reply-btn" onClick={this.showLoginMod}>登录</button>

                                                }
                                            </div>
                                            {/* 评论回复列表 */}
                                            <div className="reply-lists">
                                                {
                                                    (comm.replyLists && comm.replyLists.length > 0) ? comm.replyLists.map((replyItem) => {
                                                        return <div key={replyItem._id} className="reply-detail">
                                                            {

                                                                replyItem.fromUserInfo.avatarUrl ? <i className="avatar-init" style={this.getCommentAvatar(replyItem.fromUserInfo)}></i> : <i className="avatar-init avatar-bg"></i>
                                                            }
                                                            <span>{replyItem.fromUserName}</span>
                                                            <span className="middle-to"> 回复 </span>
                                                            {

                                                                replyItem.toUserInfo.avatarUrl ? <i className="avatar-init" style={this.getCommentAvatar(replyItem.toUserInfo)}></i> : <i className="avatar-init avatar-bg"></i>
                                                            }
                                                            <span className="reply-user-name">{replyItem.toUserName}:</span>
                                                            <span>{replyItem.commentText}</span>
                                                            <span className="reply-sub-btn" onClick={this.onToggleSubReply(comm,replyItem)}>{replyItem.showSubIn?"取消回复":'回复'}</span>
                                                           <div className="reply-sub-in" style={{display:replyItem.showSubIn?"block":"none"}}>  {/*回复子评论 */}
                                                                <input type="text" name="reply-sub-intext" placeholder={"回复" + replyItem.fromUserName} />
                                                                {this.props.isLogin?     
                                                                 <button className="reply-btn" onClick={this.onReplySubComment(comm,replyItem)}>发送回复</button>: 
                                                                 <button className="reply-btn" onClick={this.showLoginMod}>登录</button>
                                                                 }
                                                              
                                                            </div>
                                                        </div>
                                                    }) : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>

                    <div className="select-page-comm">
                        <button disabled={!this.state.commentPage} style={{ backgroundColor: this.state.commentPage ? "rgb(247, 247, 88)" : "#eee" }} onClick={this.showLastComment}>上一页</button>
                        <button disabled={this.state.commentLists.length < 4} style={{ backgroundColor: this.state.commentLists.length >=4 ? "rgb(247, 247, 88)" : "#eee" }} onClick={this.showNextComment}>下一页</button>
                    </div>
                </div>




            </div>
        )
    }
}

export default connect(state => ({
    userInfo: state.userReducer.userinfo,
    isLogin: state.userReducer.isLogin
}), {
    showLoading: showLoadingAction,
    hideLoading: hideLoadingAction
})(TalkEssay)