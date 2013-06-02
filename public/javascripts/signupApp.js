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
	,	$inputPassword = $('#inputPassword')
	,	$inputPassword2   = $('#inputPassword2')
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
			this.checkPassword();

			if ( this.hasError() ) return;
			console.log('pass');
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
		checkPassword : function(){
			if ( $inputPassword.val() === '' ) {
				$inputPassword.parents(".control-group").addClass('error').removeClass('success');
				$inputPassword.siblings('span').removeClass('hide');
			};
			if ( $inputPassword2.val() === '' ) {
				$inputPassword2.parents(".control-group").addClass('error').removeClass('success');
				$inputPassword2.siblings('span').removeClass('hide');
			};
			if ( $inputPassword.val() !== $inputPassword2.val() ) {
				$inputPassword2.parents(".control-group").addClass('error').removeClass('success');
				$inputPassword2.siblings('span').removeClass('hide');
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