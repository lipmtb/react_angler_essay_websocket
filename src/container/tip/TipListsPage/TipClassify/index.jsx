import React, { Component } from 'react'
import "./index.less";
import jieliu from "../../../../util/jieliu";
export default class TipClassify extends Component {
    state = {
        isFixed: false
    }
    componentDidMount() {
        // document.defaultView.addEventListener("scroll", this.onScrollHandle);
        this.myscroll=jieliu(this.onScrollHandle, 500,this);
        document.defaultView.addEventListener("scroll",this.myscroll);
    }
    
  

    //处理滚动事件
    onScrollHandle = (tar) => {
   
        // console.log("滚动this", this);
        // console.log("滚动", tar.scrollY);
        if (tar.scrollY > 240) {
            this.setState({
                isFixed: true
            })
        } else {
            this.setState({
                isFixed: false
            })
        }

        let newActiveIdx = this.props.coArr.findIndex((item) => {
            return tar.scrollY < item;
        });
        this.props.srollChange(newActiveIdx);
        //防抖
        // clearTimeout(this.scrollTimer);
        // this.scrollTimer = setTimeout(() => {
        //     // console.log("滚动", tar.scrollY);
        //     if ( tar.scrollY > 240) {
        //         this.setState({
        //             isFixed: true
        //         })
        //     } else {
        //         this.setState({
        //             isFixed: false
        //         })
        //     }

        //    let newActiveIdx= this.props.coArr.findIndex((item)=>{
        //         return tar.scrollY <item;
        //     });
        //     this.props.srollChange(newActiveIdx);
        // }, 60)

    }
    backTopTip = () => {
        document.defaultView.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    componentWillUnmount() {
        document.defaultView.removeEventListener("scroll", this.myscroll);
    }

    //点击某个技巧类型
    onClickType = (idx) => {
        return () => {
            this.props.onActiveChange(idx);
        }
    }
    render() {
        return (
            <div className="tip-class-lists" style={{ position: this.state.isFixed ? "fixed" : "absolute" }}>
                {
                    this.props.classifylists.map((item, idx) => {
                        return <div key={item._id} className="tip-class-item" style={{
                            backgroundColor: this.props.activeIdx === idx ? "#008c8c" : '#fff'
                        }} onClick={this.onClickType(idx)}>
                            <span className="tip-classname">{item.className}</span>
                            <span className="essay-count">{item.essayCount}</span>
                        </div>
                    })
                }
                <div className="back-top tip-class-item" onClick={this.backTopTip}>
                    <span>回顶部</span>
                </div>
            </div>
        )
    }
}
