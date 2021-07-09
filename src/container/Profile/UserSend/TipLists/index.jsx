import React from 'react'
import "./index.less";
export default function TipLists({ lists }) {
    return (
        <div className="tip-lists">
            {
                lists.map((tipitem) => {
                    return <div className="tip-item" key={tipitem._id}>
                        <div className="essay-top">
                            <div className="title-box">
                                <span className="title-pretext">标题：</span><span>{tipitem.title}</span>
                                <b className="pub-time">发布时间：{tipitem.publishTime}</b>
                            </div>
                            <div className="content-box">
                                <span className="title-pretext">内容：</span><span>{tipitem.content}</span>
                            </div>

                        </div>
                        <div className="img-show" style={{ display: (tipitem.imgArr && tipitem.imgArr.length > 0) ? "block" : "none" }}>
                            {
                                tipitem.imgArr.map((imgitem) => {
                                    return <img key={imgitem} src={imgitem} alt="技巧图片" />
                                })
                            }

                        </div>

                    </div>
                })
            }
        </div>
    )
}
