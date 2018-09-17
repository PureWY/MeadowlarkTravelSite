var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    if(req.session.userName){
        res.render('main', {username: req.session.userName});
    }else{
        res.redirect('login')
    }
})

module.exports = router;