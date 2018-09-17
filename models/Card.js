var mongoose = require('mongoose');
var CardSchema = require('../schemas/CardSchema.js');

//创建model
var Card = mongoose.model('Card',CardSchema);

module.exports = Card;