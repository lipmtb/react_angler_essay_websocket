import {MINUSMSG,INCMSG} from "../actionType";

//读取消息，减少总消息数
export function decreateMsgCount(msgcount){
    return {
        type:MINUSMSG,
        data:{
            msgcount:msgcount
        }
    }
}
//新消息增加
export function increaseMsg(newcount){
    return {
        type:INCMSG,
        data:{
            newMsgCount:newcount
        }
    }
}