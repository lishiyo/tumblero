Tumblero.Views.NewPostT4 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT4'],
	
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
		