import React, { Component,lazy } from 'react'
import {Route,Switch,Redirect} from "react-router-dom";
const TipListsPage =lazy(()=>import("./TipListsPage"));
const AddTip=lazy(()=>import("./AddTipPage"));
const TipDetail=lazy(()=>import("./TipDetail"));
export default class Tip extends Component {
    render() {
        return (
            <div className="tip-wrapper">
                <Switch>
                    <Route path="/tip/tiplists" component={TipListsPage}></Route>
                    <Route path="/tip/addtip" component={AddTip}></Route>
                    <Route path="/tip/tipdetail/:essayid" component={TipDetail}></Route>
                   <Redirect to="/tip/tiplists"></Redirect>
                </Switch>
            </div>
        )
    }
}
