import {SHOWLOADING,HIDELOADING} from "../actionType";

export function showLoadingAction(text){
    return {
        type:SHOWLOADING,
        data:text
    }
}

export function hideLoadingAction(){
    return {
        type:HIDELOADING,
        data:''
    }
}