var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    if(req.session.userInfo){
        res.render('main', {username: req.session.userInfo.username});
    }else{
        res.redirect('login')
    }
})

module.exports = router;