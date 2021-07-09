import React, { Component } from 'react'
import "./index.less";
export default class Clock extends Component {
    state={
        rad:86
    }
    componentDidMount(){
    
        let context=this.canvas.getContext("2d");
        let {width,height}=this.canvas;
        this.clockTimer=setInterval(()=>{
            context.clearRect(0,0,width,height);
            this.fillAll(context,width,height);
        },1000)

    }

    componentWillUnmount(){
        clearInterval(this.clockTimer);
    }

    fillAll=(context,width,height)=>{
       
        
        this.fillBase(context,width,height); //绘制外边轮廓
        this.fillInner(context,width,height);//绘制刻度
        this.fillNum(context,width,height);//绘制数字
        this.fillArrow(context,width,height);//绘制针
    }
    fillBase=(context,width,height)=>{
        let radgrad=context.createRadialGradient(width/2,height/2,40,width/2,height/2,90);
        radgrad.addColorStop(0,"#eee");
  
        radgrad.addColorStop(0.6,"#ddd");
        radgrad.addColorStop(0.8,"#999");
        radgrad.addColorStop(1,"#ccc");
        context.strokeStyle=radgrad;
        context.lineWidth="14";

        context.beginPath();
        context.arc(width/2,height/2,this.state.rad,0,Math.PI*2,true);
        context.closePath();
        context.stroke();

        context.fillStyle="#000";
        context.beginPath();
        context.arc(width/2,height/2,2,0,Math.PI*2,true);
        context.closePath();
        context.fill();
    }

   

    fillInner=(context,width,height)=>{
        context.strokeStyle="#333";
        context.lineWidth=2;

        for(let i=0;i<60;i++){
            context.save();
            context.translate(width/2,height/2);
            context.rotate(6*(Math.PI/180)*i);
            context.beginPath();
       
            context.moveTo(0,-height/2+22);
            context.lineTo(0,-height/2+26);
            context.closePath();
            context.stroke();
            context.restore();
            
        }
        context.strokeStyle="#000";
        context.lineWidth=3;
        for(let i=0;i<12;i++){
            context.save();
            context.translate(width/2,height/2);
            context.rotate(30*(Math.PI/180)*i);
            context.beginPath();
       
            context.moveTo(0,-height/2+22);
            context.lineTo(0,-height/2+28);
            context.closePath();
            context.stroke();
            context.restore();
            
        }
       
    }

    fillNum=(context,width,height)=>{
        // let numArr=Array.from({length:12},(item,idx)=>idx+1);
        context.strokeStyle="#008c8c";
        context.lineWidth=1;
        context.font="400 18px 黑体";
        
        for(let i=0;i<12;i++){
            context.save();
            context.translate(width/2,height/2);
            context.rotate(-30*Math.PI/180*i);

            context.strokeText((12-i)+"",-8,-height/2+40);
            context.restore();
        }

    }

    //绘制针
    fillArrow=(context,width,height)=>{
        let da=new Date();
        let hour=da.getHours();
       
        let minute=da.getMinutes();
        let second=da.getSeconds();
        // console.log("时分秒",hour,minute,second);
        
        //绘制时针
        hour=hour>12?hour%12:hour;
        let hourReg=(hour*(360/12)+minute/60*(360/12))*(Math.PI/180);
        

        context.strokeStyle="#000";
        context.lineWidth=6;
        context.save();
     
        context.translate(width/2,height/2);
        context.rotate(hourReg);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(0,-height/2+60);
        context.closePath();
        context.stroke();
        context.restore();


        //绘制分针
       
        let minuteReg=(360/60)*minute*(Math.PI/180)+(second/60)*(360/60)*(Math.PI/180);
        

        context.strokeStyle="#666";
        context.lineWidth=4;
        context.save();
     
        context.translate(width/2,height/2);
        context.rotate(minuteReg);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(0,-height/2+40);
        context.closePath();
        context.stroke();
        context.restore();


        //绘制秒
        let secondReg=(360/60)*second*(Math.PI/180);
        

        context.strokeStyle="#f00";
        context.lineWidth=2;
        context.save();
     
        context.translate(width/2,height/2);
        context.rotate(secondReg);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(0,-height/2+26);
        context.closePath();
        context.stroke();
        context.restore();

    }
    render() {
        return (
            <canvas className="clock-wrapper" width="200" height="200"ref={(node)=>{this.canvas=node}}>
 
            </canvas>
        )
    }
}
