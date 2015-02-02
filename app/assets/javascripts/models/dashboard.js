Tumblero.Models.Dashboard = Backbone.Model.extend({
	
	urlRoot: '/api/dashboard',
	
	initialize: function(opts) {
		this.user = opts.user;
		this.page = opts.page;
	},
	
	posts: function(){
		if(!this._posts) {
      this._posts = new Tumblero.Collections.Posts([], {
      	dashboard: this,
				data: { page: this.page }
      });
    }
		
    return this._posts;
	},
		
	liked_posts: function(){
		if(!this._liked_posts) {
      this._liked_posts = new Tumblero.Collections.Posts([], {
      	dashboard: this,
				data: { page: this.page }
      });
    }
		
    return this._liked_posts;
	},
	
	parse: function(response) {
		this._page = ( Number(response._page) || 1);
		this.total_pages = response.total_pages;
		
		if (response.models) {
			this.posts().set(response.models, { 
				parse: true
			});
			delete response.models;
		} 
		
		if (response.liked_posts) {
			this.liked_posts().set(response.liked_posts, { });
			delete response.liked_posts;
		} 
			
		return response;
	}
});