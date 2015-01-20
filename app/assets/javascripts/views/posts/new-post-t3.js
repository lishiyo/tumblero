Tumblero.Views.NewPostT3 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT3'],
	
	initialize: function(opts) {
		this.blogs = opts.currentUser.blogs();
	},
	
	render: function() {
		
		var content = this.template({ 
			post: this.model, 
			blogs: this.blogs });
		
		this.$el.html(content);
		this.setEditor();

		return this;
	}
});
		