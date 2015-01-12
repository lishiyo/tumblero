Tumblero.Models.Dashboard = Backbone.Model.extend({
	urlRoot: '/api/dashboard',
	initialize: function(opts) {
		this.user = opts.user;
	},
	
	posts: function(){
		if(!this._posts) {
      this._posts = new Tumblero.Collections.Posts([], {
      	dashboard: this
      });
    }
		
		console.log("dashboard posts", this._posts);
    return this._posts;
	},
	
	parse: function(response) {
		this.page = ( Number(response.page) || 1);
		this.total_pages = response.total_pages;
		
		if (response.models) {
			this.posts().set(response.models, {parse: true});
			delete response.models;
		} 
			
		return response;
	}
});