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

	// Cache
	var $inputEmail = $('#inputEmail')
	;

	// Signup app view
	var SignupAppView = Backbone.View.extend({
		el : "body",
		events : {
			"click #btnSignup" : "doSignup",
			"focusin input" : "clearViewEffect",
		},
		initialize : function(){
			console.log('hi view2');
		},
		doSignup : function(){
			this.checkEmail();			

			if ( this.hasError() ) return;
			console.log('pass');

			$.ajax({
				url: '/api/signup',
				type: 'POST',
				data: { 'email': $inputEmail.val() + '@ntu.edu.tw' },
				success: function( data ){
					console.log('ajax success');					
				},
				error: function(){
					console.log('ajax error');
				}
			});
			// var	url = '/search-ride/#' + encodeURI( JSON.stringify( obj ) );
			// window.location.href = url; 
		},
		clearViewEffect : function( e ){
			var $target = $(e.target);
			$target.parents(".control-group").removeClass('success').removeClass('error');
			$target.siblings('span').addClass('hide');
		},
		checkEmail : function(){
			if ( $inputEmail.val() === '' ) {
				$inputEmail.parents(".control-group").addClass('error').removeClass('success');
				$inputEmail.siblings('span').removeClass('hide');
			};
		},
		hasError : function(){
			if ( $('#formSignup').children('.error').length > 0 ) {
				return true;
			};
			return false;
		},

	});
	var signupAppView = new SignupAppView();

});