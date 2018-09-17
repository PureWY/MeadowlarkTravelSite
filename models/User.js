var mongoose = require('mongoose');
var UserSchema = require('../schemas/UserSchema');

//创建model，这个地方的ch_user对应mongodb数据库中ch_users的conllection
var User = mongoose.model('User',UserSchema);

module.exports = User;