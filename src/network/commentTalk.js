import axios from "axios";
import serverUrl from "./server";
import qs from "querystring";
let commTalkIns=axios.create({
    timeout:5000
})
commTalkIns.interceptors.response.use((res)=>{
    if(res.data.commentItem&&res.data.commentItem.imgArr[0]){
        res.data.commentItem.imgArr[0]=serverUrl+"/images/commentTalk/"+res.data.commentItem.imgArr[0];
    }
    if(res.data.length&&res.data.length>0){
        let newlists=res.data;
        for(let listitem of newlists){
            listitem.showReplyText=true;
            let imgArr=listitem.imgArr;
            if(imgArr&&imgArr.length>0){
                for(let i=0;i<imgArr.length;i++){
                    imgArr[i]=serverUrl+"/images/commentTalk/"+imgArr[i];
                }
            }
         

            if(listitem.userInfo.avatarUrl){
                listitem.userInfo.avatarUrl=serverUrl+"/images/avatar/"+listitem.userInfo.avatarUrl;
            }
            if(listitem.userInfo.userPsw){
                listitem.userInfo.userPsw="";
            }

            //评论回复
            if(listitem.replyLists&&listitem.replyLists.length>0){
                for(let replyitem of listitem.replyLists){
                    replyitem.showSubIn=false;//默认不显示输入回复框
                    if(replyitem.fromUserInfo.avatarUrl){
                        replyitem.fromUserInfo.avatarUrl=serverUrl+"/images/avatar/"+replyitem.fromUserInfo.avatarUrl;
                    }
                    if(replyitem.toUserInfo.avatarUrl){
                        replyitem.toUserInfo.avatarUrl=serverUrl+"/images/avatar/"+replyitem.toUserInfo.avatarUrl;
                    }
                }
            }
        }
    }
    return res.data;
})

//发送主评论
export function commentMainTalk(userInfo,commentTalkId,commentText,imgFile){
    let formdata=new FormData();
    formdata.append("anglerName",userInfo.userName);
    formdata.append("commentTalkId",commentTalkId);
    formdata.append("commentText",commentText);
    
    formdata.append("commentFiles",imgFile);
    return commTalkIns({
        url:'/proxy1/talk/commentTalk',
        data:formdata,
        method:'post',
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
}

//获取帖子的评论
export function getTalkCommentById(tid,skip,limit=4){

    return commTalkIns.get("/proxy1/talk/getTalkComment",{
        params:{
            talkId:tid,
            skip:skip*4,
            limit:limit
        }
    })
}

//回复某个mainCommentId的评论
export function sendReplyComment(mainCommentId,fromUserName,toUserName,commentText){
    return commTalkIns.post("/proxy1/talk/replyComment",qs.stringify({
        mainCommentId,
        fromUserName,
        toUserName,
        commentText
    }))
}



