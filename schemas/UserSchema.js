var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//创建UserSchema
var userSchema = new Schema({
    username: {type: String,required: true},
    password: {type: String,required: true},
})

module.exports = userSchema;