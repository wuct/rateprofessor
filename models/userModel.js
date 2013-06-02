var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;

var UserSchema = new Schema({
	username : { type : String, default : '有為青年' },
	email    : {
		address        : { type : String, required: true },
		isVerified     : { type : Boolean, default : false },
		token          : String,
		lastVerifiedAt : { type : Date, default : new Date( 2013, 3-1, 11) }, // 至少間隔 3 分鐘才重發驗證信
	}, 
	password : String
});
 
var User = mongoose.model('User', UserSchema);

module.exports = User;