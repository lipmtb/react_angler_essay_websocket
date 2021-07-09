import axios from "axios";

import qs from "querystring";

import serverUrl from "./server"
let messageIns=axios.create({
    timeout:5000
})
messageIns.interceptors.response.use((res)=>{
   
    //获取我的消息
    if(res.data.messageLists){
        let messageLists=res.data.messageLists;
        for(let message of messageLists){
            message.newMessageTime=new Date(message.newMessageTime).toLocaleString();
            if(message.essayInfo.imgArr.length>0){
                for(let i=0;i<message.essayInfo.imgArr.length;i++){
                    message.essayInfo.imgArr[i]=serverUrl+"/images/talk/"+ message.essayInfo.imgArr[i];
                }
            }
            if(message.messageArr.length>0){
                for(let commentMessage of message.messageArr){
                    if(commentMessage.fromUserInfo.avatarUrl){
                        commentMessage.fromUserInfo.avatarUrl=serverUrl+"/images/avatar/"+commentMessage.fromUserInfo.avatarUrl;
                    }
                    commentMessage.createTime=new Date(commentMessage.createTime).toLocaleString();
                }
            }
        }
    }
    return res.data;
})


//发送消息
export function createCommentMessage(userId,essayId,fromUserId,fromUserName,messageContent){
    return messageIns.post("/proxy1/message/newMainMessage",qs.stringify({
        userId,essayId,fromUserId,fromUserName,messageContent
    }))
}


//获取用户的消息列表
export function getUserMsgLists(userId,skip,limit){
    return messageIns.get("/proxy1/message/userMessage",{
        params:{
            userId,skip,limit
        }
    })
}


