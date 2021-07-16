# angler_react_app_socketio-client


## 使用技术react及其相关
+ react-router-dom(NavLink,Link,Switch(??!!!),Route,withRouter)


+ react-redux(userReducer(用户信息)页面刷新要重新把cookies传到后端重新设置userReducer,messageReducer(消息总数),loadingReducer,控制LoadingToggle的state来显示隐藏Loading公共组件)  

+ pubsub-js(消息发布与订阅，多层级组件之间传递，主要用于显示登录组件（LoginMod）)

+ axios axios.create多个instance,每个instance对响应的数据处理（instance.interceptors.response =>  处理代码xxx ;return res.data;)

+ PureComponent太少了，父组件render时候，有些子组件不该render的



## 结构 spa 
index.js --> app.js --> components(headerNav（顶部区域）),content基本内容由顶部路由切换（LoginMod，LoadingToggle包裹了一个公共组件Loading）,container下react-redux容器)


## network 网络
src --> setupProxy.js代理与后端express交互



