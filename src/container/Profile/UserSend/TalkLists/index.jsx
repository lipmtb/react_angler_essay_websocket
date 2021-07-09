import React from 'react'
import "./index.less";
export default function TalkLists({ lists }) {
    return (
        <div className="talk-lists">
            {
                lists.map((talkitem) => {
                    return <div className="talk-item" key={talkitem._id}>
                        <div className="essay-top">
                            <div className="title-box">
                                <span className="title-pretext">标题：</span><span>{talkitem.title}</span>
                                <b className="pub-time">发布时间：{talkitem.publishTime}</b>
                            </div>
                            <div className="content-box">
                                <span className="title-pretext">内容：</span><span>{talkitem.content}</span>
                            </div>

                        </div>
                        <div className="img-show" style={{ display: (talkitem.imgArr && talkitem.imgArr.length > 0) ? "block" : "none" }}>
                            {
                                talkitem.imgArr.map((imgitem) => {
                                    return <img key={imgitem} src={imgitem} alt="钓友圈图片" />
                                })
                            }

                        </div>

                    </div>
                })
            }
        </div>
    )
}
