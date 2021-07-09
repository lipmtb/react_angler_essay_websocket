import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import pubsub from "pubsub-js";
import { showLoadingAction, hideLoadingAction } from "../../../redux/actions/loadingAction"
import { getAllSelectedTipType,sendNewTip } from "network/tip";
import "./index.less";

class AddTip extends Component {
    state = {
        title:"",
        content:"",
        tipType: '饵料',   //选择的技巧类型
        titlePlaceText: '请输入标题',   //placeholder
        contentPlaceText: '输入内容描述',
        selectedClassify: [],//可选的技巧类型
        selectedImgArr: [],  //临时展示的图片
        selectedFileArr:[],//发送到后端的图片数据
        canSend:false
    }
    componentDidMount() {
        console.log("component did mount", this.props.userInfo);
        getAllSelectedTipType().then((res) => {
            console.log("获取selected类型成功", res);
            this.setState({
                selectedClassify: res.classifyLists
            })
        })
    }
    
    //输入标题
    onInputTitle=(e)=>{
        // console.log("title",e.currentTarget.value);
        this.setState({
            title:e.currentTarget.value.trim(),
            canSend:this.contentin.value.length>0||e.currentTarget.value.trim().length>0?true:false
        })
    }

    //输入内容
    onInputContent=(e)=>{
        // console.log("content",e.currentTarget.value);
        this.setState({
            content:e.currentTarget.value.trim(),
            canSend:this.titlein.value.length>0||e.currentTarget.value.trim().length>0?true:false
        })
    }

    //打开登录框
    showLoginMod=()=>{
        pubsub.publish("tologin");
    }
     //选择新图片
     onSelectNewImg = (e) => {
        // console.log("选择图片",e.currentTarget.files);
        let tmpArr=[];
        for(let img of e.currentTarget.files){
            let tmpurl=document.defaultView.URL.createObjectURL(img);
            tmpArr.push(tmpurl);
        }
        let {
            selectedImgArr,
            selectedFileArr
        }=this.state;
        this.setState({
            selectedImgArr:[...selectedImgArr,...tmpArr],
            selectedFileArr:[...selectedFileArr,...e.currentTarget.files]
        })

    }
    
    //删除选择的图片
    deleteSelected=(img,i)=>{
        return ()=>{
            this.setState(({selectedImgArr,selectedFileArr})=>{
              
                selectedFileArr.splice(i,1);
                return {
                    selectedImgArr:selectedImgArr.filter((item)=>{
                        return item!==img;
                    }),
                    selectedFileArr:[...selectedFileArr]
                }
            })
        }
      
    }
    // placeholder处理
    hidePlaceHolderTitle = () => {
        this.setState({
            titlePlaceText: ""
        })
    }
    // placeholder处理
    hidePlaceHolderContent = () => {
        this.setState({
            contentPlaceText: ""
        })
    }

    // placeholder处理
    showPlaceTitleText = () => {
        this.setState({
            titlePlaceText: "输入标题"
        })
    }
    // placeholder处理
    showPlaceContentText = () => {
        this.setState({
            contentPlaceText: "输入内容和描述"
        })
    }

    //选择技巧类型
    onSelectTipType=(e)=>{
        console.log("select tip type",e.currentTarget.value);
        this.setState({
            tipType:e.currentTarget.value
        })
    }
    //发布技巧帖子
    onSendEssay=()=>{
        // console.log(this.props.userInfo,this.state.tipType,this.state.title,this.state.content,this.state.selectedFileArr)
        this.props.showLoading("发布技巧");
        sendNewTip(this.props.userInfo,this.state.tipType,this.state.title,this.state.content,this.state.selectedFileArr).then((res)=>{
            console.log("发布结果",res);
            if(res.errCode===0){
                this.props.history.replace("/tip/tipdetail/"+res.newEssay._id)
            }
        }).finally(()=>{
            this.props.hideLoading();
        })
    }
    imgLoad=(tmpurl)=>{
        return (e)=>{

            console.log("图片loadingsuccess",tmpurl,e.currentTarget);
            document.defaultView.URL.revokeObjectURL(tmpurl);
        }
    }
    render() {
        return (
            <div className="add-tip-wrapper">
                <div className="top-tip">
                    <h2 className="title-tip-leader">技巧 &gt; 发布帖子</h2>

                    <div className="back-tiplists">

                        <Link to="/tip/tiplists">返回帖子列表</Link>
                    </div>
                </div>

                <div className="send-wrapper">
                    {/* 类型选择 */}
                    <div className="tip-type-choose">
                        <span>选择类型主题</span>
                        <select name="tiptypeSelect" onChange={this.onSelectTipType} value={this.state.tipType}  className="select-tip-type">
                            {
                                this.state.selectedClassify.map((item) => {
                                    return <option key={item._id} value={item.className}>{item.className}</option>
                                })
                            }
                        </select>
                    </div>

                    {/* 帖子标题 */}
                    <div className="title-box">

                        <input type="text" ref={(node) => { this.titlein = node; }} onChange={this.onInputTitle} onBlur={this.showPlaceTitleText} onFocus={this.hidePlaceHolderTitle} id="talkTitleField" placeholder={this.state.titlePlaceText} />
                    </div>

                    {/* 帖子内容 */}
                    <div className="content-box">

                        <textarea id="talkContentField" ref={(node) => { this.contentin = node; }} onChange={this.onInputContent} onBlur={this.showPlaceContentText} onFocus={this.hidePlaceHolderContent} placeholder={this.state.contentPlaceText} cols="20" rows="10"></textarea>

                    </div>

                    {/* 添加图片 */}
                    <div className="extra-upload">
                        <input type="file" id="selectedfile" onChange={this.onSelectNewImg} multiple accept="image/*" style={{ display: "none" }} />
                        <label htmlFor="selectedfile" className="addingFileBtn">添加图片</label>
                    </div>


                    {/* 预览图片 */}
                    <div className="view-img">
                        {
                           this.state.selectedImgArr.length>0 ? this.state.selectedImgArr.map((item, idx) => {
                                return <div key={item} className="img-outer">
                                    <img src={item} alt="垂钓鱼饵" className="imgitem" onLoad={this.imgLoad(item)}/>
                                    <i className="iconfont icon-guanbi" onClick={this.deleteSelected(item, idx)}></i>
                                </div>
                            }) : <span style={{ fontSize: "0.4em", color: "#ccc" }}>未选择</span>
                        }
                    </div>

                    {/* 发表帖子 */}
                    <div className="send-essay-outer">
                        {
                            this.props.userInfo?<button type="submit" 
                            onClick={this.onSendEssay} 
                            className="send-essay-btn" 
                            style={{backgroundColor:this.state.canSend?"rgb(50, 205, 50)":"#ccc",cursor:this.state.canSend?"pointer":"not-allowed"}}
                            disabled={!this.state.canSend}>发帖</button>:<button className="send-essay-btn" onClick={this.showLoginMod}>登录发帖</button>
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({ userInfo: state.userReducer.userinfo }),{
    showLoading:showLoadingAction,
    hideLoading:hideLoadingAction
})(AddTip)
