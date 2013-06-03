(function(app, Rate) {
	
	// Rate model
	Rate.Model = Backbone.Model.extend({
		initialize : function() {},
		idAttribute : '_id',
		urlRoot : '/api/rate',
	});

	

})(app, app.module('rate'));
