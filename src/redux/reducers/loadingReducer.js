import {SHOWLOADING,HIDELOADING} from "../actionType";
const initState={
    isLoading:0,
    loadingText:""
};
console.log("loading reducer");
const loadingReducer=(prevState=initState,action)=>{
   
        let {type,data}=action;
        switch(type){
            case SHOWLOADING:{
                return {
                    isLoading:1,
                    loadingText:data
                }
            }
            case HIDELOADING:{
                return {
                    isLoading:0,
                    loadingText:""
                }
            }
            default:{
                return prevState;
            }
        }

}

export default loadingReducer;