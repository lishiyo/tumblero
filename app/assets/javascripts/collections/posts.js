Tumblero.Collections.Posts = Backbone.Collection.extend({
	url: "/api/posts",
	model: Tumblero.Models.Post,
	
	initialize: function(models, opts){
		this.blog = (opts.blog || null);
		this.dashboard = (opts.dashboard || null);
// 		this.ordering = (opts.ordering || null);
		
// 		if (this.ordering) {
// 			this.orderBy(this.ordering);
// 		} 
	},
	
})