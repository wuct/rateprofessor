var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;

var UserSchema = new Schema({
	username : { type : String, default : '匿名學生' },
	email    :  { type : String, required: true },
	token    :  { type : String, required: true },
	password : String,

	isVerified : { type : Boolean, default : false },
});
 
var User = mongoose.model('User', UserSchema);

module.exports = User;