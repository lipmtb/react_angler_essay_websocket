import React, { Component } from 'react'
import { connect } from 'react-redux';

import pubsub from "pubsub-js"
import {getTipClassify} from "network/tip"
import TipClassify from './TipClassify';
import TipTypeLists from './TipTypeLists';

import "./index.less";
 class TipListsPage extends Component {
    state={
        activeTypeIdx:0,  //当前选择的分类
        tipClassArr:[],      //技巧类型列表
        correspondingArr:[]
    }

    componentDidMount(){
        //获取所有技巧类型
        this.getAllTipClass().then((newlists)=>{
            let sum=0;
            let coArr=[];
            for(let listitem of newlists){
                
                sum+=Math.ceil(listitem.tipLists.length/3)*160+80;
                coArr.push(sum)
            }
            coArr.unshift(0);
            this.setState({
                tipClassArr:newlists,
                correspondingArr:coArr
            })
            console.log("获取所有技巧类型",newlists,coArr);;
        });
    }

    //获取所有技巧类型
    getAllTipClass=()=>{
        return getTipClassify().then((res)=>{
            
            let newLists=res.tipLists.filter((item)=>{
                return item.tipLists&&item.tipLists.length>0;
            })
         
            return newLists;
        })
    }

    //tipClass 类型选择点击事件
    activeChange=(idx)=>{
        // console.log("选择index:",idx);
        if(this.state.activeTypeIdx===idx){
            return;
        }
        let scrollToNum=this.state.correspondingArr[idx];
        document.defaultView.scrollTo({
            top:scrollToNum,
            behavior:"smooth"
        })
        this.setState({
            activeTypeIdx:idx
        })
    }

    //页面滚动时的类型变化
    srollChange=(typeIdx)=>{
        // console.log("scrollChangeIdx",typeIdx);
        this.setState({
            activeTypeIdx:typeIdx-1
        })
    }
    toTipDetail=(tipid)=>{
        this.props.history.push("/tip/tipdetail/"+tipid);
    }
    toSendTipEssay=()=>{
        this.props.history.push("/tip/addtip")
    }
    showLoginMod=()=>{
        pubsub.publish("tologin");
    }
    render() {
        return (
            <div className="tip-list-wrapper">
                {
                    // 类型固定fixed 或者position :scroll改变
                    this.state.tipClassArr.length>0?
                    <TipClassify 
                    activeIdx={this.state.activeTypeIdx} 
                    coArr={this.state.correspondingArr}
                    onActiveChange={this.activeChange}
                    srollChange={this.srollChange}
                     classifylists={this.state.tipClassArr}/>:""
                }
                <div className="tip-typelists-leader">

                  <h2 className="tip-top-title">技巧分类</h2>
                  {
                      this.props.isLogin?  <button className="add-tip-btn" onClick={this.toSendTipEssay}>发帖</button>:
                      <button className="add-tip-btn" onClick={this.showLoginMod}>登录发帖</button>
                  }
                
                </div>

                <div className="all-type-lists">
                    {
                        // 类型列表
                        this.state.tipClassArr.map((tiptypedata)=>{
                            return <TipTypeLists navToDetail={this.toTipDetail} tipClassData={tiptypedata} key={tiptypedata._id}/>
                        })
                    }
                </div>

                
            </div>
        )
    }
}

export default connect(state=>({isLogin:state.userReducer.isLogin}))(TipListsPage);