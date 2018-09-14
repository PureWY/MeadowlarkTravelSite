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
        console.log(doc)
        if(err){
            res.send('Mongod Server Error');
        }else if(!doc){
            res.send('用户名或密码错误');
        }else{
            req.session.userName = {
                _id:doc._id,
                username:doc.username
            };
            res.render('main')
        }
    })
})

module.exports = router;