/**
 * 顺带 这里由于 servicesWorker 中用到了 fetch API，cache API，对于 cache API大致 了解一下；
 cache API：
 存在着 caches 全局对象，可以直接用来使用，这个是用 promise 进行实现的：
    这里是官方的 定义说明，以及存在的意义：

    Cache 接口为缓存的 Request / Response  对象对提供存储机制，例如，作为ServiceWorker 生命周期的一部分。请注意，Cache 接口像 workers 一样，是暴露在 window 作用域下的。尽管它被定义在 service worker 的标准中,  但是它不必一定要配合 service worker 使用.

    一个域可以有多个命名 Cache 对象。你需要在你的脚本 (例如，在 ServiceWorker 中)中处理缓存更新的方式。除非明确地更新缓存，否则缓存将不会被更新；除非删除，否则缓存数据不会过期。使用 CacheStorage.open(cacheName) 打开一个Cache 对象，再使用 Cache 对象的方法去处理缓存.

    你需要定期地清理缓存条目，因为每个浏览器都硬性限制了一个域下缓存数据的大小。缓存配额使用估算值，可以使用 StorageEstimate API 获得。浏览器尽其所能去管理磁盘空间，但它有可能删除一个域下的缓存数据。浏览器要么自动删除特定域的全部缓存，要么全部保留。确保按名称安装版本缓存，并仅从可以安全操作的脚本版本中使用缓存。查看 Deleting old caches 获取更多信息
 使用：
 1）需要打开一个 cache 存储的对象，这个试说明你要对 哪一个 cache进行操作
    window.caches.open("cacheName");
    是一个 promise ，resolve 中 返回的 就是一个 cache 对象；
 2）cache 实例对象的 操作 API
    I）add() 和 addAll() 以及 put(); (添加 cache 数据)
       add 和 addALl 是一种 事件，一个 是 批量，一个是 单个的，并且是 put 实现的 一种 简写 方式；

       addAll() 方法接受一个URL(就是 对于 作用的 相对 文件 地址也行)数组，检索它们，并将生成的response对象添加到给定的缓存中。 在检索期间创建的request对象成为存储的response操作的key；
       注意：这种方式 不会缓存 Response.status 值不在200范围内的响应
       put 就是 存储 键值，不用区分 上面的 情况；
    II）match 和 matchAll；(是为了 匹配 满足条件的 值)
    其他 api 可以 找 URL：https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/put

 */
const cachesName = "static-source";
// 在 安装的时候 判断 serviceWorker 文件 是否需要 更新，在 install 中 跳过 等待 ，详情更新 所有 打开 的 这个域名的 serviceWorker；
/* 
    *******
        如果 /sw.js 内容有更新，当访问网站页面时浏览器获取了新的文件，逐字节比对 /sw.js 文件发现不同时它会认为有更新启动 更新算法，于是会安装新的文件并触发 install 事件。但是此时已经处于激活状态的旧的 Service Worker 还在运行，新的 Service Worker 完成安装后会进入 waiting 状态。直到所有已打开的页面都关闭，旧的 Service Worker 自动停止，新的 Service Worker 才会在接下来重新打开的页面里生效
    **********
*/
/* 
更新方式 有：
    手动更新，debug更新，以及下面的 自动更新
*/
/* 
// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([

            // 更新客户端
            self.clients.claim(),

            // 清理旧版本
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== cachesName) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});
*/

self.addEventListener("install",function(event){
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            caches.open(cachesName).then(function(cache){
                return cache.addAll([
                    "/",
                    "img/1.png",
                    "img/2.png",
                    "indexedDB.js",
                    "main.js",
                    "serviceWorker.js",
                    "utils.js"
                ]);
            })
        ])
    )
});
self.addEventListener("fetch",function(event){
    event.respondWith(   
        // 这里 match 一定要注意，这个在匹配 缓存中的 req 的时候，这里 匹配得上，就算 文件 内容发生变化了，这里也会 match到，就不会 更新 新的 变化，所以这里 需要 给缓存的东西加上版本号，用到 webpack 的时候，不需要考虑这里写，有 hash，chunk；
        caches.match(event.request).then(res=>{
            // 这里的判断 先不要了，每次都去 请求资源
            // if(res)return res;
            const req = event.request.clone();
            return fetch(req).then(httpRes=>{
                if(!httpRes || httpRes.status !== 200)return httpRes;
                const resClone = httpRes.clone();
                caches.open(cachesName).then(cache=>{
                    cache.put(event.request,resClone);
                })
                return httpRes;
            })
        })
    )
});

// 这种更新 所有的 存在页面，这里需要注意浏览器也会 缓存 旧的 serviceWorker
self.addEventListener("activate",function(event){
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function(cacheList){
                return Promise.all(
                    cacheList.map(function(cacheName){
                        if(cacheName !== cachesName){
                            return caches.delete(caches.delete(cacheName))
                        }
                    })
                )
            })
        ])
    )
});