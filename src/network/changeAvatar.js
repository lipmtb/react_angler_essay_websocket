import axios from "axios";
import serverUrl from "./server";
let changeIns=axios.create({
    timeout:5000
})

changeIns.interceptors.response.use((res)=>{
    if(res.data.avatar){
        res.data.avatar.avatarUrl=serverUrl+"/images/avatar/"+res.data.avatar.avatarUrl;
    }
    return res.data;
})

export function changeNewAvatar(userid,newAvatar,rx,ry){
    let formdata=new FormData();
    formdata.append("userid",userid);
    formdata.append("radX",rx);
    formdata.append("radY",ry);
    formdata.append("avatarSrc",newAvatar);

    return changeIns({
        url:'/proxy1/user/newavatar',
        method:'post',
        data:formdata,
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
}
