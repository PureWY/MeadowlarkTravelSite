var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    req.session.userInfo = null; // 删除session
    res.redirect('login');
})

module.exports = router;