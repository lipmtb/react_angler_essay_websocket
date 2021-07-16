import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { showLoadingAction, hideLoadingAction } from "../../../redux/actions/loadingAction"
import { getHotTalk, getAllTalk, getAllNewTalk, getTotalTalkCount } from "network/talk";

import TalkEssay from "../TalkEssay"
import BackTop from "components/common/BackTop"
import PageSkip from "components/common/PageSkip/PageSkip"
import "./index.less";


class TalkListsUI extends Component {
    state = {
        curPage: 0,
        curTalkLists: [],
        totalPage: 10, //总页数
        curSelectTypeText: '热门',
        typeHeight: "0",//筛选项目高度
        showBackBtn: false  //是否显示返回顶部按钮

    }

    componentDidMount() {
        console.log("componentDidMount", this.props.match.params.type);
        let tType = this.props.match.params.type;
        if (tType === "newtalk") {
            this.getAllNewTalkList(0);

        } else if (tType === "hottalk") {

            this.getHotTalkList(0);

        } else {
            this.getAllTalkList(0);
        }
        //获取总页数
        getTotalTalkCount().then(res => {
            // console.log("获取所有钓友圈帖子总数", res);
            this.setState({
                totalPage: Math.ceil(res.total / 4)
            }, () => {
                console.log("总页数:", this.state.totalPage)
            })
        })

        document.defaultView.addEventListener("scroll", this.onTalkPageScroll);
    }

    onTalkPageScroll = (e) => {
        let target = e.currentTarget;
        clearTimeout(this.pageScrollTimer);
        this.pageScrollTimer = setTimeout(() => {

            // console.log("talk page 滚动",target.scrollY,document.body.scrollTop);
            if (target.scrollY > 600) {
                this.setState({
                    showBackBtn: true
                })
            } else {
                this.setState({
                    showBackBtn: false
                })
            }
        }, 400)
    }
    componentWillUnmount() {
        // console.log("talk page 卸载");
        document.defaultView.removeEventListener("scroll", this.onTalkPageScroll);
    }
    backTopHandle = () => {
        document.defaultView.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        this.setState({
            showBackBtn: false
        })
    }
    // 获取热门帖子
    getHotTalkList = (pageidx) => {
        return getHotTalk(pageidx, 4).then((talklists) => {
            // console.log("获取热门钓友圈帖子结果", talklists);
            this.setState({
                curTalkLists: talklists,
                curSelectTypeText: '热门',
                typeHeight: "0"
            })
        })
    }
    //获取所有帖子
    getAllTalkList = (pageidx) => {
        return getAllTalk(pageidx, 4).then((talklists) => {
            // console.log("获取所有钓友圈帖子结果", talklists);
            this.setState({
                curTalkLists: talklists,
                curSelectTypeText: '所有',
                typeHeight: "0"
            })
        })
    }

    //获取最新
    getAllNewTalkList = (pageidx) => {
        return getAllNewTalk(pageidx, 4).then((talklists) => {
            // console.log("获取最新钓友圈帖子结果", talklists);
            this.setState({
                curTalkLists: talklists,
                curSelectTypeText: '最新',
                typeHeight: "0"
            })
        })
    }

    //改变页数
    changePageIdx = (idx) => {
        this.props.showLoading("第" + (idx + 1) + "页");
        if (this.state.curSelectTypeText === "热门") {

            this.getHotTalkList(idx).then(() => {
                document.defaultView.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                this.setState({
                    curPage: idx,
                    showBackBtn: false
                })
            }).finally(() => {
                this.props.hideLoading();
            });
        } else if (this.state.curSelectTypeText === "最新") {
            this.getAllNewTalkList(idx).then(() => {
                document.defaultView.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                this.setState({
                    curPage: idx,
                    showBackBtn: false
                })
            }).finally(() => {
                this.props.hideLoading();
            });
        } else {
            this.getAllTalkList(idx).then(() => {
                document.defaultView.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                this.setState({
                    curPage: idx,
                    showBackBtn: false
                })
            }).finally(() => {
                this.props.hideLoading();
            });
        }


    }

    //选择热门
    showHotTalk = () => {
        if (this.state.curSelectTypeText === "热门") {
            return;
        }

        this.props.showLoading("加载热门");
        this.getHotTalkList(0).then(() => {
            this.props.hideLoading();
            this.props.history.replace("/talk/talklists/hottalk");
            this.setState({
                curSelectTypeText: "热门",
                typeHeight: "0",
                curPage: 0
            })
        });

    }

    //选择最新
    showAllNewTalk = () => {
        if (this.state.curSelectTypeText === "最新") {
            return;
        }

        this.props.showLoading("加载最新");
        this.getAllNewTalkList(0).then(() => {
            this.props.hideLoading();
            this.props.history.replace("/talk/talklists/newtalk");
            this.setState({
                curSelectTypeText: "最新",
                typeHeight: "0",
                curPage: 0
            })
        });
    }
    //选择所有
    showAllTalk = () => {
        if (this.state.curSelectTypeText === "所有") {
            return;
        }

        this.props.showLoading("加载所有");
        this.getAllTalkList(0).then(() => {
            this.props.hideLoading();
            this.props.history.replace("/talk/talklists/alltalk");
            this.setState({
                curSelectTypeText: "所有",
                typeHeight: "0",
                curPage: 0
            })
        });

    }

    //鼠标hover显示类型选择
    showSelectButton = () => {
        this.setState({
            typeHeight: "auto"
        })
    }
    hideSelectButton = () => {
        this.setState({
            typeHeight: "0"
        })
    }
    totalkdetail=(tid)=>{
        this.props.history.push("/talkDetail/"+tid);
    }
    render() {
        // console.log("talklist render******************");
        return (

            <div className="talk-wrapper">


                <div className="top-talk">
                    <h2 className="title-talk">钓友圈 &gt; 帖子列表</h2>

                    {/* 筛选 */}
                    <div className="select-talk-type">
                        <span className="title-sel-text">筛选</span>
                        <div className="relative-select" onMouseEnter={this.showSelectButton} onMouseLeave={this.hideSelectButton}>
                            <div className="select-fake" >
                                {this.state.curSelectTypeText}
                            </div>
                            <div className="type-btns" style={{ height: this.state.typeHeight }}>
                                <button onClick={this.showHotTalk}>热门</button>
                                <button onClick={this.showAllNewTalk}>最新</button>
                                <button onClick={this.showAllTalk}>所有</button>
                            </div>
                        </div>
                    </div>

                    <div className="send-talk">

                        <Link to="/talk/addtalk">发帖</Link>
                    </div>
                </div>


                <div className="talk-show">
                    {
                        this.state.curTalkLists.map((talk) => {
                            return <TalkEssay key={talk._id} talkdata={talk} toTalkDetailPage={this.totalkdetail}/>
                        })
                    }
                </div>
                <div className="change-page">
                    <PageSkip totalPage={this.state.totalPage} curActivePage={this.state.curPage} changePage={this.changePageIdx}></PageSkip>
                </div>
                <BackTop showBackBtn={this.state.showBackBtn} backTop={this.backTopHandle}><span>回顶部</span></BackTop>
            </div>
        )
    }
}

export default connect(state => ({ userinfo: state.userReducer.userinfo }), {
    showLoading: showLoadingAction,
    hideLoading: hideLoadingAction
})(TalkListsUI)
