var mongoose = require('mongoose')
,	Schema   = mongoose.Schema;

var rateSchema = new Schema({
	_rater : { type: Schema.Types.ObjectId, ref: 'User', required: true } ,
	clearity  : { type: Number, min: 1, max: 5 },
	easy      : { type: Number, min: 1, max: 5 },
	helpness  : { type: Number, min: 1, max: 5 },
	sweetness : { type: Number, min: 1, max: 5 },
	comment : String
});

var CourseSchema = new Schema({
	serialNum   : String,
	dep         : String,
	name        : String,
	courseNum   : String,
	title       : String,
	detailLink  : String,
	credit      : String,
	identityNum : String,
	year        : String,
	obli        : String,
	lecturer    : String,
	selMethod   : String,
	classroom   : String,
	limit       : String,
	remark      : String,
	semester    : String,
	rates       : [ rateSchema ] 
});
 
var Course = mongoose.model('Courses', CourseSchema, 'Courses');

module.exports = Course;