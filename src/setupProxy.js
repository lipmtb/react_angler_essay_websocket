const proxy=require("http-proxy-middleware");

module.exports=function(app){
    app.use(proxy('/proxy1',{
        target:'http://127.0.0.1:82',
        changeOrigin:true,
        pathRewrite:{
            '^/proxy1':''
        }
    }))
}