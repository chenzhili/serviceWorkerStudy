// 前端数据库 存储是 异步的，不用去等页面 加载好
const request = window.indexedDB.open("testDB",1121);
let db;
console.log(request);
request.onerror = function(event){
    console.log("报错了");
    console.log(event);
}
request.onsuccess = function(event){
    console.log("打开成功了",event);
    db = request.result;
    console.log(db);
    add(db);
}
request.onupgradeneeded = function(event){
    console.log(event);
    db = event.target.result;
    let objectStore;
    if(!db.objectStoreNames.contains("person")){
        objectStore = db.createObjectStore("person",{autoIncrement:true});
    }
    console.log(db);
}
function add(db){
    let request = db.transaction(["person"],"readwrite").objectStore("person").add({
        name:"张三",age:13
    });
    request.onsuccess = function(event){
        console.log("写入了",event);
        read(db);
    }
    request.onerror = function(event){
        console.log("出错了",event);
    }
}
function read(db) {
    const transaction = db.transaction(['person']);
    const objectStore = transaction.objectStore('person');
    console.log(objectStore);
    const request = objectStore.get(1);
    
    request.onerror = function(event) {
      console.log('事务失败');
    };
 
    request.onsuccess = function( event) {
       if (request.result) {
         console.log('Name: ' + request.result.name);
         console.log('Age: ' + request.result.age);
       } else {
         console.log('未获得数据记录');
       }
    };
 }