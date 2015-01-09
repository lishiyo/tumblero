Tumblero.Models.Blog = Backbone.Model.extend({
	urlRoot: '/api/dashboard',
	initialize: function(opts) {
		this.user = opts.user;
	},
	
	posts: function(){
		if(!this._posts) {
      this._posts = new Tumblero.Collections.Posts([], {
      	dashboard: this;
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