(function(app, Course) {
	// Course  Row View
	Course.CourseRowView = Backbone.View.extend({
	    render: function(){
	    	// console.log('render a ride row view');
	    	var courseRowTemplate = $('#course-row-template').html();
	        var template = _.template( courseRowTemplate,
		        {
		        	_id : this.model._id,
		        	title : this.model.title,
		        	lecturer : this.model.lecturer,
		        	semester : this.model.semester
		        }
	        );
	        // console.log('render a ride row view successed: ', template);
	        return template;
	    },
	});

	// Course model
	Course.Model = Backbone.Model.extend({
		initialize : function() {},
		idAttribute : '_id',
		urlRoot : '/api/course',
	});
	

})(app, app.module('course'));
