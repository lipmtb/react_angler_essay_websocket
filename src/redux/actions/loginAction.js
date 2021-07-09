
import {LOGIN,REGIST,SHOWLOADING,HIDELOADING,ISLOGIN,AVATAR} from "../actionType";
import {login,regist,ajaxIsLogin} from "network/loginReg";
import {changeNewAvatar} from "network/changeAvatar"

//登录Action
export function loginAction(userName,password){
    return (dispatch)=>{
        dispatch({
            type:SHOWLOADING,
            data:'登录中。。。'
        })
        login(userName,password).then((res)=>{
            console.log("loginAction 登录结果",res);
                dispatch({
                    type:LOGIN,
                    data:res
                })
                dispatch({
                    type:HIDELOADING,
                    data:''
                })
            
        }).finally(()=>{
            dispatch({
                type:HIDELOADING,
                data:''
            })
        })
    }
}


//注册action
export function registAction(userName,password){
    return (dispatch)=>{
        dispatch({
            type:SHOWLOADING,
            data:'正在注册。。。'
        })
        regist(userName,password).then((res)=>{
            console.log("loginAction注册结果",res);
                dispatch({
                    type:REGIST,
                    data:res
                })
            
        }).finally(()=>{
            dispatch({
                type:HIDELOADING,
                data:''
            })
        })
    }
}

//是否登录结果action
export function testLoginAction(){
    return (dispatch)=>{
       
        ajaxIsLogin().then((res)=>{
            console.log("是否登录结果",res)
            dispatch({
                type:ISLOGIN,
                data:res
            })
        })
    }
}

//修改头像action
export function newAvatarAction(userid,avatarImg,rx,ry){
    return (dispatch)=>{
        dispatch({
            type:SHOWLOADING,
            data:'修改头像。。。'
        })
        changeNewAvatar(userid,avatarImg,rx,ry).then((res)=>{
            console.log("修改头像结果",res);
            dispatch({
                type:AVATAR,
                data:res
            })
        }).finally(()=>{
            dispatch({
                type:HIDELOADING,
                data:''
            })
        })
    }
}

