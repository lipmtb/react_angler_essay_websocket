import React, { Component,Fragment } from 'react'
import {connect} from "react-redux";

import Loading from 'components/common/loading';
class LoadingToggle extends Component {
    render() {
        // console.log("loadingToggle render",this.props);
        return (
            <Fragment>
                {
                    this.props.isLoading?<Loading>{this.props.loadingText}</Loading>:""
                }
            </Fragment>
        )
    }
}

export default  connect(state=>({isLoading:state.loadingReducer.isLoading,loadingText:state.loadingReducer.loadingText}))(LoadingToggle)
