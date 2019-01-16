// 图片的 懒加载
function lazyLoad(dom){
    const viewHeight = window.innerHeight || doucment.documentElement.clientHeight;
    const top = dom.getBoundingClientRect().top;
    if(viewHeight - top >= 0){
        dom.src = "src";
        dom.backgroundImage = "src";
    }
}
// 简单的 节流，以第一个触发 为准
function throttle(callback,time){
    let prev = 0;
    return function(){
        let now = +new Date();
        if(now - prev >= time){
            prev = now;
            callback();
        }
    }
}
// 防抖 以最后一个 触发这为准，如果一直触发，就会一直 延迟做这件事
function debounce(callback,delay){
    let time = null;
    return function(){
        time && clearTimeout(time);
        time = setTimeout(()=>{
            callback();
        },delay);
    }
}

/*
// 节流 和 防抖 综合
delay:是为了防止 ，防抖 的 定时器一直清除，都不执行函数，导致页面长期无响应，到达这个时间都为执行的话，就强行 执行 函数
// 如果有 用 到 this 时，在此基础上加就可以了
*/
function throttleAndDebounce(callback,delay){
    let prev = +new Date(),time = null
    return function(){
        let now = +new Date();
        if(now - prev <= delay){
            time && clearTimeout(time);
            time = setTimeout(()=>{
                prev = now;
                callback();
            },1000);
        }else{
            prev = now;
            callback();
        }
    }
}