var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;

var UserSchema = new Schema({
	username : { type : String, default : '有為青年' },
	email    :  { type : String, required: true },
	password : String
});
 
var User = mongoose.model('User', UserSchema);

module.exports = User;