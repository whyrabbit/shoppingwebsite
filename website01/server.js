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


server.post("/regist", urlencodedParser, function (req, res) { //註冊
    var user = {
        Email: req.body.UserEmail,
        password: req.body.password
    }; // 那你這邊應該不是find是create 才對你之後記得改
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
    Users.findOne({
        // get 用的是 query
        "Email": req.query.UserEmail,
        "password": req.query.password
    }, function (err, docs) { //查詢有沒有該值
        if (docs == null) { //如果沒有
            res.send("請先註冊");
        } else {
            res.send("已登入"); //有該值則已註冊
        }
        
    });
}); //登入


server.use(express.static("public"));
server.listen(3000);