import React, {PureComponent } from 'react'
import "./index.less";
export default class TalkImgRun extends PureComponent {
    state={
        imgLen:0,
    
    }
    
    componentDidMount(){
        this.setState({
            imgLen:this.props.imgLists.length
        })
    }
    getCurStyle=(itemidx)=>{
      
        let middleLen=Math.floor(this.state.imgLen/2);
        let gap=itemidx-this.props.curIdx;
        if(gap>middleLen){
            gap=gap-this.state.imgLen;
        }
        if(gap<-middleLen){
            gap=gap+this.state.imgLen;
        }
       return  {
           left:gap*600+"px",
           top:0,
           zIndex:middleLen*2-Math.abs(gap)
       }
    }

    onMouseDownImg=(idx)=>{
        return (e)=>{
            // console.log("mousedown",e.clientX,e.currentTarget.dataset.imgIdx,e.currentTarget.style.left);
            this.startX=e.clientX;
            this.curIdx=idx;
            this.imglists.addEventListener("mousemove",this.mouseMoveHandle);
        }
      
    }

    onMouseUpImg=(e)=>{
        // console.log("mouseup");
        let curLeft=parseFloat(this[('img'+this.curIdx)].style.left);
        this.imglists.removeEventListener("mousemove",this.mouseMoveHandle);
        if(curLeft>-200&&curLeft<200){
            let leftIdx=this.curIdx===0?this.state.imgLen-1:this.curIdx-1;
            let rightIdx=this.curIdx===this.state.imgLen-1?0:this.curIdx+1;
            this["img"+this.curIdx].style.left="0px";
            this[('img'+leftIdx)].style.left="-600px";
            this[('img'+rightIdx)].style.left="600px";
            return;
        }
        let resIdx=this.curIdx;
        if(curLeft<-200){
         
            resIdx=this.curIdx===this.state.imgLen-1?0:this.curIdx+1;
        }
        if(curLeft>200){
            resIdx=this.curIdx===0?this.state.imgLen-1:this.curIdx-1;
        }
        this.props.changeResizeIdx(resIdx);
    }

    mouseMoveHandle=(e)=>{
        // console.log("mousemove",e.clientX);
        let moveDisX=e.clientX-this.startX;
    
         this[('img'+this.curIdx)].style.left=(parseFloat(this[('img'+this.curIdx)].style.left)+moveDisX*0.05)+"px";
         let leftIdx=this.curIdx===0?this.state.imgLen-1:this.curIdx-1;
         let rightIdx=this.curIdx===this.state.imgLen-1?0:this.curIdx+1;
         this[('img'+leftIdx)].style.left=(parseFloat(this[('img'+leftIdx)].style.left)+moveDisX*0.05)+"px";
         this[('img'+rightIdx)].style.left=(parseFloat(this[('img'+rightIdx)].style.left)+moveDisX*0.05)+"px";
    }

    onMouseLeave=()=>{
        let curLeft=parseFloat(this[('img'+this.curIdx)].style.left);
        this.imglists.removeEventListener("mousemove",this.mouseMoveHandle);
        if(curLeft>-200&&curLeft<200){
            let leftIdx=this.curIdx===0?this.state.imgLen-1:this.curIdx-1;
            let rightIdx=this.curIdx===this.state.imgLen-1?0:this.curIdx+1;
            this["img"+this.curIdx].style.left="0px";
            this[('img'+leftIdx)].style.left="-600px";
            this[('img'+rightIdx)].style.left="600px";
            return;
        }
        let resIdx=this.curIdx;
        if(curLeft<-200){
         
            resIdx=this.curIdx===this.state.imgLen-1?0:this.curIdx+1;
        }
        if(curLeft>200){
            resIdx=this.curIdx===0?this.state.imgLen-1:this.curIdx-1;
        }
        this.props.changeResizeIdx(resIdx);
    }
    render() {
    //    console.log("TalkImgRun render******************",this.props.curIdx);
        return (
                <ul className="img-lists"  ref={(node)=>{this.imglists=node;}} 
             >
                    {
                        this.props.imgLists.map((img,idx)=>{
                            return <li className="img-li" key={img} 
                            style={this.getCurStyle(idx)}
                            onMouseDown={this.onMouseDownImg(idx)}
                            onMouseUp={this.onMouseUpImg}
                            onMouseLeave={this.onMouseLeave}
                            data-img-idx={idx}
                            ref={(node)=>{this[('img'+idx)]=node;}}
                            >
                                <img src={img}  alt="chuidiao,tiezi" draggable="false" />
                            </li>
                        })
                    }
                </ul>
        )
    }
}
