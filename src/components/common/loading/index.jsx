import React, { Component } from 'react'
import "./index.less"
export default class Loading extends Component {
    state = { total: [1,2,3,4,5,6,7,8,9,10,11,12], curBigIdx: 0 }
    componentDidMount() {

        this.timer=setInterval(()=>{
            this.setState(state=>{
                let {curBigIdx,total}=state;
                curBigIdx++;
                curBigIdx=curBigIdx>total.length-1?0:curBigIdx;
                return {
                    total:total,
                    curBigIdx:curBigIdx
                }
            })
        },100)
    }

    componentWillUnmount(){
        // console.log("unmount loading");
        clearInterval(this.timer);
    }
    render() {
        // console.log("runCicle render", this.props.children);
        let deg=360/this.state.total.length;
        return (
            <div className="loading-wrapper">
                <ul className="circle-lists">
                    {
                        this.state.total.map((item, idx) => {

                            return (<li key={idx} className="circle-item" style={{transform:"rotate("+idx*deg+"deg)"}}>
                                <span className="inner-box" style={{transform:idx===this.state.curBigIdx?'scale(1.6)':'scale(1)'}}></span>
                            </li>)
                        })
                    }
                    
                   
                </ul>
                <div className="center-text">
                         {this.props.children }
                </div>
            </div>
        )
    }
}
