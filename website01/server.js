var express = require("express"); //目前最穩定、使用最廣泛開發框架
var cookieParser = require('cookie-parser'); //可以用在登入上
var bodyParser = require('body-parser');
var server = express();
// 创建 application/x-www-form-urlencoded 编码解析
//var Strategy = require('passport-local').Strategy;//登入註冊
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
//for upload file
var formidable = require("formidable"); //可以用post的東西
var fs = require("fs"); //文件系統

//取得NEDB套件
var DB = require('nedb');
var Users = new DB({
    filename: 'Users.db',
    autoload: true
}); //autoload:自動將資料庫載入記憶體
var About=new DB({
    filename: 'About.db',
    autoload: true
})

server.post("/regist", urlencodedParser, function (req, res) { //註冊
    var user = {
        UserName: req.body.UserName,
        Email: req.body.UserEmail,
        password: req.body.password
    }; 
    
    Users.findOne({
        "Email": req.body.UserEmail
    }, function (err, docs) { //查詢有沒有該值
        if (docs == null) { //如果沒有
            if (req.body.rpassword != req.body.password) { //查詢重複密碼是否正確
                console.log("確認密碼不同，請重新輸入"); //不正確
            } else { //正確新增
                Users.insert(user, function (err, newUser) {})
            };
        } else {
            console.log("已註冊"); //有該值則已註冊
        }
    });

});

server.get("/login", urlencodedParser, function (req, res) {
    var message = {
        check: ""
    }  
    Users.findOne({
        // get 用的是 query
        "UserName": req.query.UserName,
        "password": req.query.password
    }, function (err, docs) { //查詢有沒有該值
        if (docs == null) { //如果沒有
            console.log( req.query.UserName);
            message.check="錯誤帳號密碼" ; 
            res.send(message); 
            return;
            console.log("沒值");
        } else {
            message.check="歡迎使用" ; 
            res.send(message); 
            console.log("有值");
            return;
        }
    });
}); //登入
server.post("/about", urlencodedParser, function (req, res) { //About
    var userMessage = {
        UserName: req.body.UserName,
        Email: req.body.UserEmail,
        Telephone:req.body.Telephone,
        password: req.body.password,
        message:req.body.message
    }; 
    if(req.body.UserName.length==0 || req.body.UserEmail.length==0 ||  req.body.Telephone.length==0 ||  req.body.password.length==0 ||  req.body.message.length==0){
        console.log("有值為0"); 
    }else{
        About.insert(userMessage, function (err, newuserMessage) {})
    }

});


server.use(express.static("publish"));
server.listen(3000);