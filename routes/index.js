var express = require('express');
var router = express.Router();
var user = require('./login.js')
var main = require('./main.js')
var loginOut = require('./loginOut.js')

var routers = function (app) {
    app.use('/', main);
    app.use('/login', user);
    app.use('/loginOut', loginOut);

    //定制404页面
    app.use(function(req,res){
        res.status(404);
        res.render('404');
    });

    //定制500页面
    app.use(function(err,req,res,next){
        console.log('err.stack');
        res.status(500);
        res.send('500');
    });
}

module.exports = routers;