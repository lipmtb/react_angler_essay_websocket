import {
    LOGIN,
    REGIST,
    ISLOGIN,
    AVATAR
} from "../actionType";
const initState = {
    userinfo: null,
    errMsg: '',
    errCode: 0,
    isLogin:false  //是否登录
}

console.log("loginRedeucer");
const loginRegReducerFn= (prevState = initState, action) =>{
    let {
        type,
        data
    } = action;
    switch (type) {
        case ISLOGIN:{
            console.log("reducer是否登录");
            let newState = {
                userinfo: data.userinfo,
                errMsg: data.errMsg||"",
                errCode: data.errCode,
                isLogin: data.userinfo?true:false
            }
            return newState;
        }
        case LOGIN: {
            console.log("reducer登录");

            let newState = {
                userinfo: data.userinfo || null,
                errMsg: data.errMsg,
                errCode: data.errCode,
                isLogin:data.userinfo?true:false
            }
            return newState;

        }
        case REGIST: {
            console.log("reducer注册");
            let newState = {
                userinfo: data.userinfo || null,
                errMsg: data.errMsg,
                errCode: data.errCode,
                isLogin:data.userinfo?true:false
            }
            return newState;
        }
        case AVATAR:{
            console.log("reducer修改头像");
            let newState = {
                userinfo: {
                    _id:prevState.userinfo._id,
                    userName:prevState.userinfo.userName,
                    avatarUrl:data.avatar.avatarUrl,
                    avatarRadX:data.avatar.avatarRadX,
                    avatarRadY:data.avatar.avatarRadY
                },
                errMsg: data.errMsg,
                errCode: data.errCode,
                isLogin:prevState.isLogin,
                
            }
            return newState;
        }
        default: {
            return prevState;
        }
    }
}

export default loginRegReducerFn;