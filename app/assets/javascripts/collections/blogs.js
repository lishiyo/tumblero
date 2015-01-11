Tumblero.Collections.Blogs = Backbone.Collection.extend({
	url: '/api/blogs',
	
	model: Tumblero.Models.Blog,
	
	initialize: function(opts){
		if (opts.user) {
			this.user = opts.user;
		}
	},
	
	getOrFetch: function (id) {
    var blog = this.get(id),
      blogs = this;
		
    if(!blog) {
      blog = new Tumblero.Models.Blog({ id: id });
      blog.fetch({
        success: function () {
          blogs.add(blog, {merge: true});
        },
      });
    } else {
      blog.fetch();
    }
    return blog;
	}

})