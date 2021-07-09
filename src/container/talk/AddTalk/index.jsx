import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import pubsub from "pubsub-js"
import { showLoadingAction, hideLoadingAction } from "../../../redux/actions/loadingAction"
import {sendNewTalk} from "network/talk"
import "./index.less";
class AddTalk extends Component {
    state = {
        titlePlaceText: "输入标题",
        contentPlaceText: '输入内容和描述',
        selectedImgArr: [],
        selectedFileArr:[],
        hasImg:false,
        title:"",
        content:"",
        canSend:false  //是否能发帖子
    }
    componentDidMount(){
        if(!this.props.userinfo){
            pubsub.publish("tologin");
        }
    }
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
            selectedFileArr:[...selectedFileArr,...e.currentTarget.files],
            hasImg:true
        })

    }
    //删除选择的图片
    deleteSelected=(img,i)=>{
        return ()=>{
            this.setState(({selectedImgArr,selectedFileArr})=>{
                let hasImg=true;
                if(selectedImgArr.length<=1){
                    hasImg=false;
                }
                selectedFileArr.splice(i,1);
                return {
                    selectedImgArr:selectedImgArr.filter((item)=>{
                        return item!==img;
                    }),
                    selectedFileArr:[...selectedFileArr],
                    hasImg:hasImg
                }
            })
        }
      
    }
    //发布帖子
    onSendEssay=()=>{
        //console.log("发布帖子",this.props.userinfo,this.titlein.value,this.contentin.value,this.state.selectedFileArr);
        this.props.showLoading("发布中。。。");
        sendNewTalk(this.props.userinfo,this.titlein.value,this.contentin.value,this.state.selectedFileArr).then((res)=>{
            console.log("发布新钓友圈帖子结果：",res);
            if(res.errCode===0){
                this.props.history.push("/talk/talklists/newtalk")
            }
        }).finally(()=>{
            this.props.hideLoading();
        })
    }

    onInputTitle=(e)=>{
        // console.log("title",e.currentTarget.value);
        this.setState({
            title:e.currentTarget.value.trim(),
            canSend:this.contentin.value.length>0||e.currentTarget.value.trim().length>0?true:false
        })
    }

    onInputContent=(e)=>{
        // console.log("content",e.currentTarget.value);
        this.setState({
            content:e.currentTarget.value.trim(),
            canSend:this.titlein.value.length>0||e.currentTarget.value.trim().length>0?true:false
        })
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
    render() {
        return (
            <div className="add-talk-wrapper">
                 <div className="top-talk">
                    <h2 className="title-talk">钓友圈 &gt; 发布帖子</h2>

                    <div className="send-talk">

                        <Link to="/talk/talklists">返回帖子列表</Link>
                    </div>
                </div>
               
                <div className="send-wrapper">
                    <div className="title-box">

                        <input type="text" ref={(node)=>{this.titlein=node;}} onChange={this.onInputTitle} onBlur={this.showPlaceTitleText} onFocus={this.hidePlaceHolderTitle} id="talkTitleField" placeholder={this.state.titlePlaceText} />
                    </div>
                    <div className="content-box">

                        <textarea id="talkContentField" ref={(node)=>{this.contentin=node;}} onChange={this.onInputContent} onBlur={this.showPlaceContentText} onFocus={this.hidePlaceHolderContent} placeholder={this.state.contentPlaceText} cols="20" rows="10"></textarea>

                    </div>
                    <div className="extra-upload">
                        <input type="file" id="selectedfile" onChange={this.onSelectNewImg} multiple accept="image/*" style={{ display: "none" }} />
                        <label htmlFor="selectedfile" className="addingFileBtn">添加图片</label>
                    </div>

                    <div className="view-img">
                        {
                            this.state.hasImg?this.state.selectedImgArr.map((item,idx) => {
                                return <div key={item} className="img-outer">
                                    <img src={item} alt="垂钓鱼饵" className="imgitem" />
                                    <i className="iconfont icon-guanbi" onClick={this.deleteSelected(item,idx)}></i>
                                </div>
                            }):<span style={{fontSize:"0.4em",color:"#ccc"}}>未选择</span>
                        }
                    </div>
                    <div className="send-essay-outer">
                        {
                            this.props.userinfo?<button type="submit" 
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


export default connect(state => ({ userinfo: state.userReducer.userinfo }), {
    showLoading: showLoadingAction,
    hideLoading: hideLoadingAction
})(AddTalk);
