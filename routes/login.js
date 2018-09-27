var express = require('express');
var router = express.Router();

//引入模型
var User = require('../models/User.js');

router.get('/',function(req,res,next){
    res.render('login')
})

router.post('/',function(req,res,next){
    User.findOne({
        username: req.body.userName,
        password: req.body.passWord
    },(err,doc)=>{
        if(err){
            res.send({
                code: 200,
                message: "数据库异常!"
            });
        }else if(!doc){
            res.send({
                code: 200,
                message: "用户名或密码错误!"
            });
        }else{
            req.session.userInfo = {
                _id:doc._id,
                username:doc.username
            };
            res.send({
                code: 201,
                message: "登录成功!"
            });
        }
    })
})

module.exports = router;