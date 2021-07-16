

import  {INCMSG, MINUSMSG,MSGCOUNT} from "../actionType";
const messageCount=0;
const messageReducer=function (initState=messageCount,action){

    let {type,data}=action;
    switch(type){
        case MSGCOUNT:{
            return data.total;
        }
        case MINUSMSG:{
            return initState-data.msgcount;
        }
        case INCMSG:{
            return initState+data.newMsgCount;
        }
        default:{
            return initState;
        }
    }
}

export default messageReducer;