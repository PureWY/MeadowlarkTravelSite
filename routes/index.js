var express = require('express');
var router = express.Router();

 module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render('home', {title: '草鹨旅行网'});
    });

    app.get('/about', function (req, res) {
        res.render('about', {title: '关于'});
    });

    app.get('/jquerytest',function(req,res){
        // res.type('text/plain');
        // res.send('Meadowlark Travel');
        res.render('jquerytest');
    });
    app.get('/nursery-rhyme',function(req,res){
        res.render('nursery-rhyme');
    })
    //AJAX返回数据
    app.get('/data/nursery-rhyme',function(req,res){
        res.json({
            animal: 'squirrel',
            bodyPart: 'tail',
            adjective: 'bushy',
            noun: 'heck',
        })
    })
    app.get('/newsletter',function(req,res){
        res.render('newsletter',{csrf: 'CSRF token goes here'});
    })
    app.get('/newsletter-ajax',function(req,res){
        res.render('newsletter-ajax',{csrf: 'CSRF token goes here'});
    })
    app.get('/thank-you',function(req,res){
        res.render('thank-you');
    })
    //普通的请求处理
    app.post('/process',function(req,res){
        console.log('Form (from querystring): ' + req.query.from);
        console.log('CSRF token (from hidden from field): ' + req.body._csrf);
        console.log('Name (from visible from field): ' + req.body.name);
        console.log('Email (from visible from field): ' + req.body.email);
        res.redirect(303,'/thank-you');
    })
    //AJAX请求处理
    app.post('/processajax',function(req,res){
        if(req.xhr || req.accepts('json,html') === 'json'){
            //如果发生错误，应该发送{error: 'error description'}
            res.send({success: true});
        }else{
            //如果发生错误，应该重定向到错误页面
            res.redirect(303,'/thank-you');
        }
    })
    
    //文件上传处理
    app.get('/contest/vacation-photo',function(req,res){
        var now = new Date();
        res.render('contest/vacation-photo',{
            year: now.getFullYear(),month: now.getMonth()
        });
    });
    app.post('/contest/vacation-photo/:year/:month',function(req,res){
        var form = new formidable.IncomingForm();
        form.parse(req,function(err,fields,files){
            if(err) return res.redirect(303,'/error');
            console.log('received fields');
            console.log(fields);
            console.log('received files');
            console.log(files);
            res.redirect(303,'/thank-you');
        })
    })
    
    app.get('/about',function(req,res){
        // res.type('text/plain');
        // res.send('About Meadowlark Travel');
        res.render('about',{fortune: fortune.getFortune()});
    })

    //定制404页面
    app.use(function(req,res){
        // res.type('text/plain');
        // res.status(404);
        // res.send('404 - Not Found');
        res.status(404);
        res.render('404');
    });

    //定制500页面
    app.use(function(err,req,res,next){
        console.log('err.stack');
        // res.type('text/plain');
        res.status(500);
        res.send('500');
    });
}