import React, { Component } from 'react'
import { connect } from 'react-redux'
import {newAvatarAction} from "../../redux/actions/loginAction"
import "./index.less"

 class ChangeAvatarUI extends Component {
    state = {
        newAvatar: null,
        curPosX:0,//窗体背景图位置
        curPosY:0, 
        posX:0, //窗体位置
        posY:0,
        file:null,
        canCommitNew:true
    }
    getBackgroundPosition=()=>{
        return `${this.state.curPosX/2}px ${this.state.curPosY/2}px`
    }
   //选择新头像
    onSelectedNewAvatar = (e) => {
        // console.log(e.currentTarget.files);
        let file = e.currentTarget.files[0];
        
        let temp = document.defaultView.URL.createObjectURL(file);
        this.setState({
            newAvatar: temp,
            file:file
        })

    }
    downCurtain=(e)=>{
           this.boxLeft=this.boxResize.offsetLeft;
        this.boxTop=this.boxResize.offsetTop;
        //  console.log("box left,box top",this.boxLeft,this.boxTop);
        // console.log("mousedown",e);
        this.startClientX=e.clientX;
        this.startClientY=e.clientY;
        this.disX=this.startClientX-this.state.posX-this.boxLeft;
        this.disY=this.startClientY-this.state.posY-this.boxTop;
        this.runCur.addEventListener("mousemove",this.moveCurtain);
    }

    moveCurtain=(e)=>{
        // console.log("mousemove",e);
        let moveX=e.clientX;
        let moveY=e.clientY;
        let newPosX=moveX-this.boxLeft-this.disX;
        let newPosY=moveY-this.boxTop-this.disX;
        newPosX=newPosX<0?0:newPosX;
        newPosX=newPosX>40?40:newPosX;
        newPosY=newPosY<0?0:newPosY;
        newPosY=newPosY>40?40:newPosY;
        this.setState({
            posX:newPosX, //窗体位置
            posY:newPosY,
            curPosX:-newPosX,//窗体背景图位置
            curPosY:-newPosY, 
        })
    }

    upCurtain=(e)=>{
        // console.log("mouseup",e);
        this.runCur.removeEventListener("mousemove",this.moveCurtain);
    }

    //提交新头像信息
    submitNewAvatar=()=>{
        //post提交图片数据和头像bgposx比率,bgposy比率
        let radX=-this.state.curPosX/160;
        let radY=-this.state.curPosY/160;
        console.log("提交",this.state.file,radX,radY);
        this.setState({
            canCommitNew:false
        })
        this.props.submitAvatarAction(this.props.userid,this.state.file,radX,radY);
        setTimeout(()=>{
            this.setState({
                canCommitNew:true
            })
        },5000)
    }
    render() {
        // console.log("changeAvatar render",this.props);
        return (
            <div className="change-avatar-wrapper">
                <h2>修改头像</h2>
                <div className="ch-avatar">
                    {/* 头像预览 */}
                    <div className="avatar-box preview-avatar-box">

                        {
                            this.state.newAvatar ?
                                <div className="new-avatar-show" style={{ 
                                    backgroundImage: `url(${this.state.newAvatar})`,
                                    backgroundPosition:this.getBackgroundPosition() }}>
                                </div> : <div className="new-avatar-show init-img"></div>
                        }

                        <p>头像预览</p>
                    </div>

                    {/* 选择新头像 */}
                    <div className="avatar-box select-new-avatar">
                        {
                            this.state.newAvatar ?
                                <div className="resize-wrapper" ref={(node)=>{this.boxResize=node;}}>
                                    <div className="resize-img" style={{ backgroundImage: `url(${this.state.newAvatar})` }}></div>
                                    <div className="black-mod"></div>
                                    <div className="run-box" onMouseDown={this.downCurtain} 
                                   ref={(node)=>{this.runCur=node;}}
                                    onMouseUp={this.upCurtain}
                                    style={{
                                         backgroundImage: `url(${this.state.newAvatar})`,
                                         backgroundPositionX:this.state.curPosX+"px", 
                                         backgroundPositionY:this.state.curPosY+"px",
                                         left:this.state.posX+"px",
                                         top:this.state.posY+"px" 
                                         }}>
                                
                                   </div>
                                </div> :""
                            
                               
                        }

                        <div className="open-file-select">
                            <input type="file" id="fileinput" name="filelists" onChange={this.onSelectedNewAvatar} accept="image/*" style={{ display: 'none' }} />
                            <label htmlFor="fileinput" className="selectImageBtn">
                                上传新头像
                            </label>
                        </div>
                        {
                            this.state.newAvatar?<button className="confirm-submit" onClick={this.submitNewAvatar} disabled={!this.state.canCommitNew} style={{backgroundColor:this.state.canCommitNew?'#69fdb3':"#eee"}}>确认</button>:""
                        }
                    </div>
                </div>

            </div>
        )
    }
}


export default connect(state=>({userid:state.userReducer.userinfo._id}),{
    submitAvatarAction:newAvatarAction
})(ChangeAvatarUI);