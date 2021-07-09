import axios from "axios";
import qs from "querystring";
import serverUrl from "network/server";
let loginIns=axios.create({
    timeout:5000
})
loginIns.interceptors.response.use((res)=>{
    if(res.data.userinfo){
        if(res.data.userinfo.avatarUrl){
            res.data.userinfo.avatarUrl=serverUrl+"/images/avatar/"+res.data.userinfo.avatarUrl;
        }
    }
    return res.data;
})

// 登录
export function login(userName,password){

    return loginIns.post(
       '/proxy1/login',
        qs.stringify({
            userName:userName,
            password:password
        })
    )
}

//注册
export function regist(userName,password){
    return loginIns.post(
        '/proxy1/regist',
         qs.stringify({
             userName:userName,
             password:password
         })
     )
}
//appjs判断是否登录，刷新是重新运行
export function ajaxIsLogin(){
    return loginIns.get("/proxy1/islogin")
}