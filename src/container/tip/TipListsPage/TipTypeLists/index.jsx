import React, { Component } from 'react'
import "./index.less";
export default class TipTypeLists extends Component {
    navToTipDetail=(title,tipid)=>{
        return (e)=>{
            e.preventDefault();
            console.log("查看tip帖子"+title+"的详情，id:",tipid);
           this.props.navToDetail(tipid);
        }
    }
    render() {
        return (
            <div className="tip-type-lists">
                <h3 className="tip-type-text">{this.props.tipClassData.className}</h3>
                <ul className="essay-bref-lists">
                    {
                        this.props.tipClassData.tipLists.map((tipessay) => {

                            return <li key={tipessay._id} className="tip-li-item">
                                <a href={tipessay.imgArr[0]} className="essay-link-wrapper" onClick={this.navToTipDetail(tipessay.title,tipessay._id)}>
                                    <div className="left-img">
                                        {
                                            tipessay.imgArr.length > 0 ?
                                                <img src={tipessay.imgArr[0]} alt="垂钓技巧" /> : ""
                                        }
                                    </div>

                                    <div className="tipessay-main">
                                        <p className="tipessay-title" title={tipessay.title}>{tipessay.title}</p>
                                        <div className="tipessay-footer">
                                            <span className="pub-username">发布者：{tipessay.userInfo.userName}</span>
                                        </div>
                                    </div>

                                </a>

                            </li>
                        })
                    }
                </ul>
            </div>
        )
    }
}
