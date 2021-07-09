import React, { PureComponent, lazy } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

const AddTalk = lazy(() => import("container/talk/AddTalk"))
const TalkLists = lazy(() => import("container/talk/TalkLists"))
class TalkUI extends PureComponent {
    render() {
        console.log("talk page render");
   
            return (

                <div className="talk-wrapper">
                    <Switch>
                        <Route path="/talk/talklists/:type" component={TalkLists}></Route>
                        <Route path="/talk/addtalk" component={AddTalk}></Route>
                        <Redirect to="/talk/talklists/hottalk"></Redirect>
                    </Switch>
                </div>
            )
         

    }
}

export default connect(state => ({ isLogin: state.userReducer.isLogin }))(TalkUI);
