// Module singleton
var app = {
	module: function() {
		var modules = {};
		return function(name) {
		    if (modules[name]) {
		    return modules[name];
		    }
		    return modules[name] = {};
		};
	}()
};

jQuery(function($) {
	'use strict';

	// Dependencies
	var Rate = app.module('rate');

	// setting _.template
    _.templateSettings = {
	    evaluate    : /<\?([\s\S]+?)\?>/g,
	    interpolate : /<\?=([\s\S]+?)\?>/g,
	    escape      : /<\?-([\s\S]+?)\?>/g
	};

	// Cache
	var $inputClearity = $('#inputClearity')
	,	$inputEasy = $('#inputEasy')
	,	$inputHelpness = $('#inputHelpness')
	,	$inputSweetness = $('#inputSweetness')
	,	$inputComment = $('#inputComment')
	,	$btnDoRate = $('#btnDoRate')
	,	_course = getCourseId()
	;

	// Signup app view
	var RatingAppView = Backbone.View.extend({
		el : "body",
		events : {
			"click #btnDoRate" : "doRate",
		},
		initialize : function(){
			console.log('hi view2');
		},
		doRate : function(){
			console.log('start rate');

			var rate = new Rate.Model({
				_course : _course,
				clearity  : $inputClearity.val(),
				easy      :  $inputEasy.val(),
				helpness  :  $inputHelpness.val(),
				sweetness :  $inputSweetness.val(),
				comment : $inputComment.val(),
			});
			console.log( rate );
			rate.save({},
				{	
					success : function( rate ){
						// console.log('@@@', rate );
						// render
						var rateRowTemplate = $('#rate-row-template').html();
				        var template = _.template( rateRowTemplate,
					        {
					        	rate : rate.attributes
					        }
				        );
				        $('.ratesContainer').prepend( template );

					//TODO: handle error
					},
					error : function( ){
						console.log('saving error');
					}
				}
			);
		}

	});
	var ratingAppView = new RatingAppView();

});