var express = require('express');
var router = express.Router();

//引入模型
var User = require('../models/User.js');

router.get('/',function(req,res,next){
    res.render('register')
})
router.post('/',function(req,res,next){
    if(req.body.passWord != req.body.confirmPassWord){
        res.send({
            code: 500,
            message: '两次密码输入的不一致，请重新输入!'
        });
    }else if(!req.body.userName){
        res.send({
            code: 501,
            message: '请输入正确的表单信息!'
        });
    }else{
        User.findOne({
            username: req.body.userName
        },(err,doc)=>{
            if(err){
                res.send({
                    code: 501,
                    message: '数据库异常!'
                });
            }else if(doc){
                res.send({
                    code: 501,
                    message: '该用户已存在，请登录!'
                });
            }else{
                User.create({username: req.body.userName,password: req.body.passWord},(err,doc1)=>{
                    if(err){
                        res.send({
                            code: 501,
                            message: '数据库异常!'
                        });
                    }else{
                        res.send({
                            code: 501,
                            message: '注册成功!'
                        });
                    }
                });  
            }
        })
    }
})

module.exports = router;