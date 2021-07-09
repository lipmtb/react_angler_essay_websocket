import axios from "axios";
import serverUrl from "network/server";
let tipins = axios.create({
    timeout: 5000
})

tipins.interceptors.response.use((res) => {

    //获取所有的技巧类型
    if (res.data.tipLists) {
        for (let tipclass of res.data.tipLists) {
            for (let tipessay of tipclass.tipLists) {
                if (tipessay.userInfo && tipessay.userInfo.avatarUrl) {
                    tipessay.userInfo.avatarUrl = serverUrl + "/images/avatar/" + tipessay.userInfo.avatarUrl;
                }
                if (tipessay.imgArr && tipessay.imgArr.length > 0) {
                    for (let i = 0; i < tipessay.imgArr.length; i++) {
                        tipessay.imgArr[i] = serverUrl + "/images/tip/" + tipessay.imgArr[i];
                    }
                }
            }


        }
    }
    //获取帖子详情
    if (res.data.essay) {
        let essay = res.data.essay;
        if (essay.userInfo.avatarUrl) {

            essay.userInfo.avatarUrl = serverUrl + "/images/avatar/" + essay.userInfo.avatarUrl;
        }
        if (essay.imgArr && essay.imgArr.length > 0) {
            for (let i = 0; i < essay.imgArr.length; i++) {
                essay.imgArr[i] = serverUrl + "/images/tip/" + essay.imgArr[i];
            }
        }
    }

    //发布的技巧
    if (res.data.sendTip) {
        let sendLists = res.data.sendTip;
        for (let item of sendLists) {
            if (item.imgArr && item.imgArr.length > 0) {
                for (let i = 0; i < item.imgArr.length; i++) {
                    item.imgArr[i] = serverUrl + "/images/tip/" + item.imgArr[i];
                }
            }
        }
    }
    return res.data;
})

//发布一条帖子
export function sendNewTip(userInfo, tipType, title, content, filelists) {

    let formdata = new FormData();
    formdata.append("userid", userInfo._id);
    formdata.append("username", userInfo.userName);
    formdata.append("tipType", tipType);
    formdata.append("title", title);
    formdata.append("content", content);
    for (let file of filelists) {
        formdata.append("fileLists", file);
    }

    return tipins({
        url: '/proxy1/tip/addNewTip',
        data: formdata,
        method: 'post',
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })

}

//获取所有的技巧类型
export function getTipClassify() {
    return tipins({
        url: '/proxy1/tip/tipClassSomeEssays'
    })
}

//发布帖子页面select获取类型
export function getAllSelectedTipType() {
    return tipins({
        url: '/proxy1/tip/tipClassify'
    })
}


//获取技巧帖子详情
export function getTipDetailByTipId(tid) {
    return tipins.get('/proxy1/tip/tipEssayDetail', {
        params: {
            tipId: tid
        }
    })
}

//获取我发布的技巧
export function getMySendTip(userId, skip, limit = 4) {
    return tipins.get("/proxy1/tip/mySendTip", {
        params: {
            userId: userId,
            skip: skip,
            limit: limit
        }
    })
}