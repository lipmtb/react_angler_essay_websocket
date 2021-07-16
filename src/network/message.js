import axios from "axios";

import qs from "querystring";
import timeFormated from "jsutil/time"
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
                message.messageArr.sort((last,next)=>{
                    return new Date(next.createTime)-new Date(last.createTime);
                })
                for(let commentMessage of message.messageArr){
                    if(commentMessage.fromUserInfo.avatarUrl){
                        commentMessage.fromUserInfo.avatarUrl=serverUrl+"/images/avatar/"+commentMessage.fromUserInfo.avatarUrl;
                    }
                    commentMessage.createTime=timeFormated(commentMessage.createTime);
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


//发送消息
export function createReplyCommentMessage(userId,essayId,fromUserId,fromUserName,messageContent,fromUserComment){
    return messageIns.post("/proxy1/message/replyMessage",qs.stringify({
        userId,essayId,fromUserId,fromUserName,messageContent,fromUserComment
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


//获取总消息数
export function getUserMsgTotal(userId){
    return messageIns.get("/proxy1/message/allMsgCount/"+userId)
}

//用户展开消息读取，服务端messageCount=0
export function userReadEssayMsg(userid,essayid,count){
    return messageIns.post("/proxy1/message/readEssayMsg",qs.stringify({
        userId:userid,essayId:essayid,count:count
    }))
}