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
	
	posts: function(orderMethod){
		
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