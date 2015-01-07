Tumblero.Collections.Blogs = Backbone.Collection.extend({
	url: '/blogs',
	
	model: Tumblero.Models.Blog,
	
	initialize: function(opts){
		if (opts.user) {
			this.user = opts.user;
		}
	}
})