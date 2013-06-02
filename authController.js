var	SendGrid = require('sendgrid').SendGrid
// ,	sendgrid = new SendGrid( 'hellopro', 'hellopro123')
,	sendgrid = new SendGrid( process.env.SENDGRID_USER, process.env.SENDGRID_PASS )
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
		res.send( { STATUS : 'OK' });
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
	
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({ email: username }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}

				// valid password
				// create token
				if( !password ) return done(null, false, { message: 'Incorrect password.' });
				var shasum = crypto.createHash('sha1');
				shasum.update( password );
				var hashedPassword = shasum.digest('hex');
				if ( user.password !== hashedPassword ) {
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

	// check user is exist
	User
	.findOne({ email : req.body.email })
	.exec( function ( err, user ){
		if ( err ) return next( err );
		if ( user ) {
			user.token = token;
		} else {
			var user = new User({
				email : req.body.email,
				token : token
			});
		}

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
				subject : '[教授您好] 請驗證您的電子郵件地址',
				text    : '您設定了一個新信箱，在驗證此電子郵件地址正確無誤前，Carpo 不會自動寄送任何通知給您。若要驗證電子郵件地址，請按一下此連結或貼在瀏覽器上：\n ' + url
			};
			sendgrid.send( options, function(success, message) {
				if (!success) {
					return res.send({ STATUS : 'SENDGRID_ERROR', message : message});
				}
				console.log('successfully sent a mail to user : ', user.email );
				res.send({ STATUS : 'OK' });
			});
		});

	});


};

exports.emailVerify = function (req, res, next){
		console.log( req.params );

		// decode
		try {
			var decipher = crypto.createDecipher( 'aes-256-cbc','12dsf243znbr6z3123123dfadfsadw' );
			var plainText = decipher.update( req.params.cipherText,'hex','utf8' );
			plainText += decipher.final( 'utf8 ');
			console.log('plainText : ', plainText );
			var cipherText = req.params.cipherText;
		} catch (err) {
			console.error('decode failed while verifying email. err : ', err);
			return next( new Error('驗證失敗'));
		}

		// JSON parse
		try {
			var emailVerificationObj = JSON.parse( plainText );
		} catch (err) {
			console.error('JSON parse failed while verifying email. err : ', err);
			return next( new Error('驗證失敗'));
		}

		// verify
		User
		.findOne( { email : emailVerificationObj.email } )
		.exec( function (err, user ){
			if( err ) return next(err);
			if( !user ) {
				console.error('can not find user %s while verifying email', emailVerificationObj.email);
				return next( new Error('驗證失敗'));
			}
			// console.log( user );

			// compare token
			console.log( 'token compare\n%s\n%s', emailVerificationObj.token, user.token )
			if ( emailVerificationObj.token !== user.token ) {
				// verification failed
				console.log('email verification token is not match', user.email);
				return next( new Error('驗證失敗'));
			}

			// verification successed
			user.isVerified = true;
			user.save( function (err){
				if(err) return next(err);

				res.render('activation', { title: '啟動帳號', email : user.email });
			});

		});

};


exports.activate = function(req, res, next){
	console.log( req.body);

	// create token
	if( !req.body.password ) return next( new Error('missing password'));
	var shasum = crypto.createHash('sha1');
	shasum.update( req.body.password );
	var hashedPassword = shasum.digest('hex');
	
	// save password
	User
	.findOne( { email : req.body.email } )
	.exec( function (err, user ){
		if( err ) return next(err);
		if( !user ) {
			console.error('can not find user %s while verifying email', req.body.email);
			return next( new Error('找不到這個使用者'));
		}
		// console.log( user );

		user.password = hashedPassword;
		user.save( function (err){
			if(err) return next(err);

			res.send({ _user : user._id, STATUS : 'OK' });
		});

	});
}
