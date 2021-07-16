import React, { Component } from 'react'
import "./index.less";
export default class index extends Component {
    state = {
        curHeaderWidth: 100
    }
    componentWillUnmount() {
        clearInterval(this.headerTimer);
    }
    componentDidMount() {
        this.headerTimer = setInterval(() => {
            let { curHeaderWidth } = this.state;
            curHeaderWidth += 10;
            curHeaderWidth = curHeaderWidth > 300 ? 100 : curHeaderWidth;
            this.setState({
                curHeaderWidth: curHeaderWidth
            })
        }, 100)
    }

    render() {
        return (
            <div className="top-headertext" style={{ width: this.state.curHeaderWidth + "px" }}>

                <h2>帖子详情</h2>
            </div>
        )
    }
}
