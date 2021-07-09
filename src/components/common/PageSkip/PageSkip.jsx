import React, { Component } from 'react'
import "./PageSkip.less";
export default class PageSkip extends Component {
    changeToPage=(idx)=>{
        return ()=>{

            this.props.changePage(idx);
        }
    }
    render() {
        let array=Array.from({length:this.props.totalPage},(i,item)=>item);
        return (
            <div className="page-skip-lists">
                <div className="middle-wrapper">
                {
                        array.map((item)=>{
                            return <button key={item} disabled={this.props.curActivePage===item} 
                            style={{color:this.props.curActivePage===item?"#f00":"#000",
                        backgroundColor:this.props.curActivePage===item?"rgb(123,237,61)":"#c4c9c7"}} 
                            className="page-item" onClick={this.changeToPage(item)}>
                                第{item+1}页
                            </button>
                        })
                    }
                </div>
                  
            </div>
        )
    }
}
