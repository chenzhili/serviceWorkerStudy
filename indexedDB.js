// 前端数据库 存储是 异步的，不用去等页面 加载好
const request = window.indexedDB.open("testDB", 1);
let db;
console.log(request);
request.onerror = function (event) {
    console.log("报错了");
    console.log(event);
}
request.onsuccess = function (event) {
    console.log("打开成功了", event);
    db = request.result;
    console.log(db);
    add(db);
    // getAll(db);
    selectByIndex(db);
}
request.onupgradeneeded = function (event) {
    console.log(event);
    db = event.target.result;
    let objectStore;
    if (!db.objectStoreNames.contains("person")) {
        objectStore = db.createObjectStore("person",
            {
                autoIncrement: true //这是 自动生成主键
                // keyPath:"id"
            }
        );
    }
    objectStore.createIndex("indexAge","age",{unique:false});
    console.log(db);
}
/* 
注意，事务在被创建的时候就已经开始，并非在发起第一个请求（IDBRequest)的时候。例如下面的例子;
一个事务可以 做 一系列的事情，但是 如果其中有一个 报错了，也会回滚到执行前
*/
function add(db) {
    let request = db.transaction(["person"], "readwrite").objectStore("person").add({
        name: "李四", age: 133,id:"a2"
    });
    request.onsuccess = function (event) {
        console.log("写入了", event);
        
        read(db);
    }
    request.onerror = function (event) {
        console.log("出错了", event);
    }
}
function read(db) {
    const transaction = db.transaction(['person']);
    const objectStore = transaction.objectStore('person');
    console.log(objectStore);
    const request = objectStore.get(14);
    console.log(request);
    request.onerror = function (event) {
        console.log('事务失败');
    };

    request.onsuccess = function (event) {
        console.log(request);
        
        if (request.result) {
            console.log('Name: ' + request.result.name);
            console.log('Age: ' + request.result.age);
        } else {
            console.log('未获得数据记录');
        }
    };
}
function getAll(db){
    const objectStore = db.transaction(["person"],"readOnly").objectStore("person");
    objectStore.openCursor().onsuccess = function(event){
        let cursor = event.target.result;
        if(cursor){
            console.log(cursor.key)
            cursor.continue();
        }else{
            console.log("没数据了");
        }
    }
}
// 对此，所有对表的操作都是 事务的异步 操作，这里还有 更新 put,删除 delete

/* 
    索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键（即从主键取值）。
*/
function selectByIndex(db){
    let objectStore = db.transaction(["person"]).objectStore("person");
    // objectStore.createIndex("name","name",{unique:false})
    // 上面代码中，IDBObject.createIndex()的三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）。
    // console.log(objectStore);
    let index = objectStore.index("indexAge");
    let request = index.openCursor(IDBKeyRange.only(133));
    // let request = index.get(133); 
    request.onsuccess = function(e){
        let cursor = e.target.result;
        if(cursor){
            // console.log(cursor);
            cursor.continue();
        }
    }
    request.onerror = function(e){
        console.log("索引查找出错了");
    }
}