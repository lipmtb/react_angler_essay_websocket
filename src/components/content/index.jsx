import React, { Component, lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

import LoginTest from 'container/LoginTest'
const TalkPage = lazy(() => import("container/talk"))
const TipPage = lazy(() => import("container/tip"))
const ProfilePage = lazy(() => import("container/Profile"))

export default class Content extends Component {



    render() {
        return (
            <div className="angler-content">
                <Suspense fallback={<h3>正在加载中。。。</h3>}>
                    <Switch>

                        <Route path="/talk" component={TalkPage}></Route>

                        <Route path="/tip" component={TipPage}></Route>
                        <Route path="/profile" component={ProfilePage}></Route>

                        <LoginTest></LoginTest>
                    </Switch>
                </Suspense>


            </div>
        )
    }
}
