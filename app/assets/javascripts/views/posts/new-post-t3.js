Tumblero.Views.NewPostT3 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT3'],
	
// 	events: {
// 		"submit form": "submitForm"
// 	},
	
	initialize: function(opts) {
		this.blogs = opts.currentUser.blogs();
	},
	
	// over ride to combine quotes
// 	submitForm: function(e) {
// 		e.preventDefault();
		
// 	},
	
	render: function() {
		
		var content = this.template({ 
			post: this.model, 
			blogs: this.blogs });
		
		this.$el.html(content);
		this.setEditor();

		return this;
	}
});
		