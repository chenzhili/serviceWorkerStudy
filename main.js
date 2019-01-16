window.onload = function(){
    /* const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    console.log(viewHeight);
    const test = document.getElementById("test"); */
    // 初始化 页面
    const container = document.querySelector(".container");
    let generateList = ()=>{
        const fragmentDoc = document.createDocumentFragment();
        new Array(30).fill(1).forEach((v,i)=>{
            let div = document.createElement("div");
            div.className="div";
            div.innerHTML = `<img class="img" data-src="${i%2===0?'img/1.png':'img/2.png'}"/>`;
            fragmentDoc.appendChild(div);
        });
        return fragmentDoc;
    }
    container.appendChild(generateList());
    let lazyLoad = ()=>{
        const list = container.querySelectorAll("img");
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        list.forEach(img=>{
            let src = img.dataset.src;
            const top = img.getBoundingClientRect().top;
            if(viewHeight - top >=0){
                img.src = src;
            }
        });
        
    }
    lazyLoad();

    window.addEventListener("scroll",throttleAndDebounce(lazyLoad,1000),false);
}