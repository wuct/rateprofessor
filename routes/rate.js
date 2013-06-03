var Course = require('../models/courseModel')
;	


exports.add = function( req, res, next){
	console.log( req.body );
	// check login
	if (!req.user) return next( new Error('您必須先登入') );

	Course
	.findById( req.body._course )
	.exec( function (err, course){
		if(err) return next(err);
		
		console.log( course );
		course.rates.push({
			_rater : req.user._id,
			clearity  : req.body.clearity,
			easy      : req.body.easy,
			helpness  : req.body.helpness,
			sweetness : req.body.sweetness,
			comment : req.body.comment
		});

		console.log('@@', course.rates );

		course.save( function( err){
			if(err) return next(err);
			res.send( course.rates[ course.rates.length - 1 ]);
		})

	});

};