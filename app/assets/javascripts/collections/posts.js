Tumblero.Collections.Posts = Backbone.Collection.extend({
	url: "/api/posts",
	modal: Tumblero.Models.Post,
	initialize: function(models, opts){
		this.blog = (opts.blog || null);
		this.dashboard = (opts.dashboard || null);
	}
})