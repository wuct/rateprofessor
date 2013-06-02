var	SendGrid = require('sendgrid').SendGrid
,	sendgrid = new SendGrid( process.env.SENDGRID_USER, process.env.SENDGRID_PASS)
;

var	passport = require('passport')
,	LocalStrategy = require('passport-local').Strategy
,	crypto   = require('crypto')
,	User     = require('./models/userModel')
;

exports.setup = function( app ){

	app.post('/login',
		passport.authenticate('local'),
		function(req, res) {
		// If this function gets called, authentication was successful.
		// `req.user` contains the authenticated user.
		res.redirect('/');
	});




	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};






exports.passportConfigure = function(){

	// console.log('passport setup start');

	// Passport session setup.
	//	 To support persistent login sessions, Passport needs to be able to
	//	 serialize users into and deserialize users out of the session.	Typically,
	//	 this will be as simple as storing the user ID when serializing, and finding
	//	 the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		// console.log('serializeUser@@@@@@@@@@@@@@@', user, done);

		// 將 user id 存入 cookie session
		done(null, {
			_id : user._id
		});
	});

	passport.deserializeUser(function( user, done) {
		// console.log('deserializeUser@@@@@@@@@@',user, done);
		User
		.findById( user._id )
		.exec( function (err, user) {
			done(err, user);
		});
	});
	
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	));


};



exports.signup = function(req, res, next){
	console.log( req.body );
	if ( !req.body.email ) return res.send({ STATUS : 'NO_EMAIL'});

	// create token
	var shasum = crypto.createHash('sha1');
	shasum.update( String( Math.random() ) );
	var token = shasum.digest('hex');

	// console.log('create a token : ', token );

	// save token
	var user = new User({
		email : req.body.email,
		token : token
	});
	user.save( function (err){
		if (err) return next(err);
		console.log('saved a email verification token : ', token );

		// create url
		var emailVerificationObj = {
			email  : user.email,
			token  : user.token
		};

		// encode 
		var cipher = crypto.createCipher('aes-256-cbc', '12dsf243znbr6z3123123dfadfsadw');
		var encodedText = cipher.update( JSON.stringify( emailVerificationObj ) , 'utf8', 'hex');
		encodedText += cipher.final('hex');

		console.log('encoded text : ', encodedText);


		// var url = 'http://localhost:3000/api/mail/verify/' + encodedText;
		// for development testing
		var url = 'http://local.host:3000/api/mail/verify/' + encodedText;

		// send verify mail

		var options = {
			to      : user.email,
			from    : 'noreply@carpo.co',
			subject : '教授您好：請驗證您的電子郵件地址',
			text    : '您設定了一個新信箱，在驗證此電子郵件地址正確無誤前，Carpo 不會自動寄送任何通知給您。若要驗證電子郵件地址，請按一下此連結或貼在瀏覽器上：\n ' + results.url
		};
		sendgrid.send( options, function(success, message) {
			if (!success) {
				return callback( message )
			}
			console.log('successfully sent a mail to user : ', user._id );
			callback( null );
		});
	});
};


