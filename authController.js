var	passport = require('passport')
,	LocalStrategy = require('passport-local').Strategy
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
