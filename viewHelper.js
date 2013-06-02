
module.exports = function( app ){
	return function(req, res, next){
		


		// dynamic view helper
		var loggedIn = req.user ? true : false;
		var user     = req.user ? req.user : { equals : function(){return false;} } // add equals() while user didn't log in
		res.locals.passport = { user : user, loggedIn : loggedIn};
		
		next();
	};
};