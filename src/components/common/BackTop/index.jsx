import React, { Component } from 'react'
import "./index.less";
export default class BackTop extends Component {
    backToPage=()=>{
        this.props.backTop();
    }
    render() {
        return (
            <div className="backtop-wrapper" style={{display:this.props.showBackBtn?"block":"none"}}  onClick={this.backToPage}>
                    <div className="center-back">
                      {this.props.children}
                    </div>
            </div>
        )
    }
}
