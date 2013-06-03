var Course = require('../models/courseModel')
,	_ = require('underscore')
;


// CRUD
exports.search = function(req, res, next){
	console.log( req.body.title );

	Course
	.find({ title : req.body.title})
	.exec(function (err, courses){
		if (err) return next( err );
		res.send( courses );
	});


};

exports.detailPage = function(req, res, next){
	console.log( req.params._id );

	Course
	.findById( req.params._id )
	.exec(function (err, course){
		if (err) return next( err );
		if (!course ) return next( new Error('找不到課程。') );

		var sumClearity = _.reduce( course.rates, function(memo, rate){ return memo + rate.clearity; }, 0);
		var sumEasy = _.reduce( course.rates, function(memo, rate){ return memo + rate.easy; }, 0);
		var sumHelpness = _.reduce( course.rates, function(memo, rate){ return memo + rate.helpness; }, 0);
		var sumSweetness = _.reduce( course.rates, function(memo, rate){ return memo + rate.sweetness; }, 0);
		res.render('courseDetail', {
			title : course.lecturer + course.title,
			course : course,
			avgClearity : sumClearity / course.rates.length,
			avgEasy : sumEasy / course.rates.length,
			avgHelpness : sumHelpness / course.rates.length,
			avgSwetness : sumSweetness / course.rates.length,
		});
	});


};