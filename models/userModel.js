var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;

var emailSchema = Schema({
	address        : { type : String, required: true },
	isVerified     : { type : Boolean, default : false },
	token          : String,
	lastVerifiedAt : { type : Date, default : new Date( 2013, 3-1, 11) }, // 至少間隔 3 分鐘才重發驗證信
});

var UserSchema = new Schema({
	username : { type : String, default : '有為青年' },
	email    : emailSchema, 
	password : String
});
 
var User = mongoose.model('User', UserSchema);

module.exports = User;