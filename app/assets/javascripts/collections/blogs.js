Tumblero.Collections.Blogs = Backbone.Collection.extend({
	url: '/api/blogs',
	
	model: Tumblero.Models.Blog,
	
	initialize: function(opts){
		if (opts.user) {
			this.user = opts.user;
		}
	}
})