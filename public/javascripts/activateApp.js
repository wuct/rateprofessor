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
	var	$inputPassword = $('#inputPassword')
	,	$inputPassword2   = $('#inputPassword2')
	;

	// Signup app view
	var ActivationAppView = Backbone.View.extend({
		el : "body",
		events : {
			"click #btnSignup" : "doSignup",
			"focusin input" : "clearViewEffect",
		},
		initialize : function(){
			console.log('hi view2');
		},
		doSignup : function(){
			this.checkPassword();

			if ( this.hasError() ) return;
			console.log('pass');

			$.ajax({
				url: '/api/activate',
				type: 'POST',
				data: { 'email': getEmail(),
						'password': $inputPassword.val() },
				success: function( data ){
					console.log('ajax success');	
					window.location.href = '/login'; 
									
				},
				error: function(){
					console.log('ajax error');
				}
			});
		},
		clearViewEffect : function( e ){
			var $target = $(e.target);
			$target.parents(".control-group").removeClass('success').removeClass('error');
			$target.siblings('span').addClass('hide');
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
				$inputPassword2.siblings('span.equal-error').removeClass('hide');
			};
		},
		hasError : function(){
			if ( $('#formSignup').children('.error').length > 0 ) {
				return true;
			};
			return false;
		},

	});
	var activationAppView = new ActivationAppView();

});