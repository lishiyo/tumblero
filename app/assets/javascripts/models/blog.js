Tumblero.Models.Blog = Backbone.Model.extend({
	urlRoot: '/api/blogs',
	
	initialize: function(opts) {
		this.user = opts.user;
	},
	
	validate: function(attrs, opts){
		var newHandle = attrs.handle.toLowerCase().replace(/\s+/g, "-");
		
		function isValid(char) {
			return char.match(/(\w+|-)/);
		}
		
		if (!newHandle.split("").every(isValid)) {
			return "handle can contain only letters, digits, underscores, or dashes";
		}
		
	},
	
	posts: function(){	
		if(!this._posts) {
      this._posts = new Tumblero.Collections.Posts([], {
        blog: this,
				data: { page: this.page }
      });
    }
				
    return this._posts;
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
		
		return response;
	},
	
// 	parse: function(resp) {
// 		if (resp.posts) {
// 			this.posts().set(resp.posts, {parse: true});
// 			delete resp.posts;
// 		} 
			
// 		return resp;
// 	}
	
});