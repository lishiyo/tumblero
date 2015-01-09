Tumblero.Models.Blog = Backbone.Model.extend({
	urlRoot: '/api/blogs',
	initialize: function(opts) {
		this.user = opts.user;
	},
	
	posts: function(){
		if(!this._posts) {
      this._posts = new Tumblero.Collections.Posts([], {
        blog: this
      });
    }
		
    return this._posts;
	},
	
	parse: function(resp) {
		if (resp.posts) {
			this.posts().set(resp.posts, {parse: true});
			delete resp.posts;
		} 
			
		return resp;
	}
});