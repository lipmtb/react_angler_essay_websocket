import axios from "axios";
import serverUrl from "./server";
let talkins=axios.create({
    timeout:5000
})
talkins.interceptors.response.use((res)=>{
    
    if(res.data.length&&res.data.length>0){
        let newlists=res.data;
        for(let listitem of newlists){
            let imgArr=listitem.imgArr;
            if(imgArr&&imgArr.length>0){
                for(let i=0;i<imgArr.length;i++){
                    imgArr[i]=serverUrl+"/images/talk/"+imgArr[i];
                }
            }
         

            if(listitem.userInfo&&listitem.userInfo.avatarUrl){
                listitem.userInfo.avatarUrl=serverUrl+"/images/avatar/"+listitem.userInfo.avatarUrl;
            }
            if(listitem.userInfo&&listitem.userInfo.userPsw){
                listitem.userInfo.userPsw="";
            }
        }
    }

    //我的发布
    if(res.data.sendTalk){
        let sendLists=res.data.sendTalk;
        for(let item of sendLists){
            if(item.imgArr&&item.imgArr.length>0){
                for(let i=0;i<item.imgArr.length;i++){
                    item.imgArr[i]=serverUrl+"/images/talk/"+item.imgArr[i];
                }
            }
        }
    }
    return res.data;
})

//发布一条帖子
export function sendNewTalk(userInfo,title,content,filelists){

    let formdata=new FormData();
    formdata.append("userid",userInfo._id);
    formdata.append("username",userInfo.userName);
    formdata.append("title",title);
    formdata.append("content",content);
    for(let file of filelists){
        formdata.append("fileLists",file);
    }

    return talkins({
        url:'/proxy1/talk/addNewTalk',
        data:formdata,
        method:'post',
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })

}
//获取热门钓友圈
export function getHotTalk(skip,limit=4){

    return talkins.get(
       '/proxy1/talk/hotTalk',{
          params:{
            skip:skip*4,
            limit:limit
         }
       }
        
    )
}

//获取所有钓友圈
export function getAllTalk(skip,limit=4){

    return talkins.get(
       '/proxy1/talk/allTalk',{
          params:{
            skip:skip*4,
            limit:limit
         }
       }
        
    )
}

//获取最新
export function getAllNewTalk(skip,limit=4){

    return talkins.get(
       '/proxy1/talk/allNewTalk',{
          params:{
            skip:skip*4,
            limit:limit
         }
       }
        
    )
}

//获取钓友圈帖子的评论数
export function getTalkCommentCount(talkId){
    return talkins.get(
        '/proxy1/talk/essayCommentCount',{
           params:{
            talkId:talkId
          }
        }
         
     )
}


//获取钓友圈帖子总数
export function getTotalTalkCount(){
    return talkins.get('/proxy1/talk/totalTalk')
}

//获取我发布的钓友圈
export function getMyTalkSend(userId,skip,limit=4){
    return talkins.get("/proxy1/talk/myTalkSend",{
        params:{
            userId:userId,
            skip:skip,
            limit:limit
        }
    })
}