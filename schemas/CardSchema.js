var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//创建CardSchema
var CardSchema = new Schema({
    name: {type: String,required: true},
    cardImgUrl: {type: String,required: true},
    price: {type: String,required: true},
    cardImgName: {type: String,required: true},
})

module.exports = CardSchema;