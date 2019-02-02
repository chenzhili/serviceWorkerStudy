if("serviceWorker" in  navigator){
    window.addEventListener("load",function(){
        navigator.serviceWorker.register("./ServiceWorkerET.js",{scope:"/"}).then(function(registration){
            console.log('注册成功；', registration.scope);
        }).catch(function(err){
            console.log("注册失败");
        });
    },false); 
}