# angler_react_app_socketio-client


## 使用技术react及其相关
+ react-router-dom(NavLink,Link,Switch(??!!!),Route,withRouter)


+ react-redux(userReducer(用户信息)页面刷新要重新把cookies传到后端重新设置userReducer,messageReducer(消息总数),loadingReducer,控制LoadingToggle的state来显示隐藏Loading公共组件)  

+ pubsub-js(消息发布与订阅，多层级组件之间传递，主要用于显示登录组件（LoginMod（componentDidMount订阅））)

+ axios axios.create多个instance,每个instance对响应的数据处理（instance.interceptors.response =>  处理代码xxx ;return res.data;)

+ React.PureComponent太少了，父组件render时候，有些子组件不该render的



## 结构 SPA
index.js --> app.js --> components(headerNav（顶部区域，NavLink）),content基本内容由顶部路由切换（Route,LoginMod，LoadingToggle包裹了一个公共组件Loading）,container文件夹：react-redux容器，index.js Provider:store)


## network 网络
src --> setupProxy.js代理与后端express交互


## 功能模块

### 登录注册（注册完后自动登录）
+ 后端返回cookie 设置有效期30分钟，SameSite:默认lax（前端代理无所谓）cookie,domain都在前端所在的域
`
res.cookie("userid", userdoc._id, {
        maxAge: 30 * 60 * 1000
      });
      res.cookie("username", userName, {
        maxAge: 30 * 60 * 1000
      });
`

+ react-redux每次都重置....，只为了在react-redux中保存登录用户的信息：前端每次刷新（cookie有效期内会在请求中带上cookie）都要向服务端判断登录状态（app.js 发起异步action:testLoginAction,axiosAjax请求（代理不会有跨域的问题，ajax不跨域能发cookie这里不担心），axios.get("/proxy1/islogin")），后端解析cookie中的信息返回给前端，前端react-redux dispatchAction 保存用户信息，一次次刷新页面重复的工作...


## 修改头像
**用户的头像**
+ backgroundImage:url(serverUrl+"/images/avatar/xxx") image/*
+ backgroundPositionX:头像x偏移
+ backgroundPositionY:头像y偏移


## 钓友圈
+ 发布（input:file,后端multiparty解析）
+ 评论（评论消息:socket.io-client(serverUrl),后端socket.io）
   后端不仅存储消息，emit(userId+"xxx")通知某个被评论的人
+ 后端：
`const io=require("socket.io")(server,{cors: true });
`

## 技巧

+ 发布
+ 分类滚动（滚动节流,每个被限制执行函数被关在一个区域内，区域内有一把锁，一段时间打开一次）

## 我的消息
+ (消息总数react-redux保存，或者利用pubsub-js消息发布与订阅也可以)
+ react-redux: messageReducer
  登录成功和（刷新页面）是否登录要重新向服务端获取消息总数，store总状态存储(（messageReducer:MSGCOUNT))
+ socket.io-client on(userId+"xxxx") 实时更新新消息数(修改总消息数量（messageReducer:INCMSG新增加消息)
+ 展开消息 修改总消息数量（messageReducer:MINUSMSG，读取减少消息）













 



