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
	var Course = app.module('course');


	// setting _.template
    _.templateSettings = {
	    evaluate    : /<\?([\s\S]+?)\?>/g,
	    interpolate : /<\?=([\s\S]+?)\?>/g,
	    escape      : /<\?-([\s\S]+?)\?>/g
	};

	// Cache
	var $txtSearchInput = $('#txtSearchInput')
	,	$resultContainer = $('.resultContainer')
	,	$searchingView = $('.searchingView')
	,	$nonResultView = $('.nonResultView')
	;

	// Signup app view
	var SearchAppView = Backbone.View.extend({
		el : "body",
		events : {
			"click #btnSearch" : "doSearch",
		},
		initialize : function(){
			console.log('hi view');
		},
		doSearch : function(){
			console.log('start search', $txtSearchInput.val() );
			var queryStr = $txtSearchInput.val();

			// check empty
			if( queryStr === '' ) return; 

			// set searching ui
			$nonResultView.addClass('hide');
			$searchingView.removeClass('hide');

			$.ajax({
				url: '/api/search/',
				type: 'POST',
				data: { 'title': queryStr },
				success: function( courses ){
					console.log('ajax success', courses);

					// non results
					if (courses.length == 0) {
						$searchingView.addClass('hide');
						$nonResultView.removeClass('hide');
						return;
					};


					// set searching ui
					$searchingView.addClass('hide');
					$resultContainer.html('');

					// render
					courses.forEach( function( course, index ){
						var courseRowView = new Course.CourseRowView({ model : course });
						console.log('@@@',courseRowView)
						$resultContainer.append( courseRowView.render() );
					});
				},
				error: function(){
					console.log('ajax error');

					// set searching ui
					$searchingView.addClass('hide');

				}
			});
		},
		

	});
	var searchAppView = new SearchAppView();

});