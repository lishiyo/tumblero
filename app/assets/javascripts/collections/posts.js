Tumblero.Collections.Posts = Backbone.Collection.extend({
// 	url: "/api/posts",
	
	url: function(){
		if (this.dashboard) {
			return this.dashboard.urlRoot + "/posts.json"
		} else if (this.blog) {
			return this.blog.url() + "/posts.json";
		} 
	},
	
// 	comparator: function(post){
// 		return post.get('created_at');
// 	},
	
	model: Tumblero.Models.Post,
	
	initialize: function(models, opts){
		this.blog = (opts.blog || Tumblero.current_user.blogs().first());
		this.dashboard = (opts.dashboard || null);
// 		this.ordering = (opts.ordering || null);
		
// 		if (this.ordering) {
// 			this.orderBy(this.ordering);
// 		} 
	},
	
	// hits api/posts
	parse: function(response) {
		this.page = ( Number(response.page) || 1);
		this.total_pages = response.total_pages;
		// deal with any nested resources on response.models and return
		return response.models;
	}
	
});
