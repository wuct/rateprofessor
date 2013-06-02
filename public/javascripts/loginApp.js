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
	var $inputPassword = $('#inputPassword')
	;

	// Signup app view
	var LoginAppView = Backbone.View.extend({
		el : "body",
		events : {
			"click #btnSignup" : "doLoginin",
			"focusin input" : "clearViewEffect",
		},
		initialize : function(){
			console.log('hi view2');
		},
		doLoginin : function(){
			this.checkEmail();		
			this.checkPassword();		

			if ( this.hasError() ) return;
			console.log('pass');

			$.ajax({
				url: '/login',
				type: 'POST',
				data: { 'email': $inputEmail.val() + '@ntu.edu.tw', password : $inputPassword.val() },
				success: function( data ){
					console.log('ajax success', data);
					if ( data.STATUS === 'OK' )
					window.location.href = '/'; 

				},
				error: function(){
					console.log('ajax error');

				}
			});
			// window.location.href = url; 
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
	var loginAppView = new LoginAppView();

});