Tumblero.Collections.Posts = Backbone.Collection.extend({
// 	url: "/api/posts",
	
	url: function(){
		if (this.dashboard) {
			return this.dashboard.urlRoot + "/posts.json"
		} else if (this.blog) {
			return this.blog.url() + "/posts.json";
		} 
	},

	
	model: Tumblero.Models.Post,
	
	initialize: function(models, opts){
		this.blog = (opts.blog || Tumblero.current_user.blogs().first());
		this.dashboard = (opts.dashboard || null);

	},
	
	filterByTag: function(tag) {
		// wrapped => returns collection
		return _(this.filter(function(post){
			var tagsArr = post.get("tags_string").split(", "); 
			return tagsArr.some(function(elem){
				return elem === tag;
			});
		}));
	},
	
	// hits api/posts
	parse: function(response) {
		this._page = ( Number(response._page) || 1);
		this.total_pages = response.total_pages;
		// deal with any nested resources on response.models and return
		return response.models;
	}
	
});
