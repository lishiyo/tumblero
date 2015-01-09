Tumblero.Models.Tagging = Backbone.Model.extend({
	urlRoot: "/api/taggings",
	
	initialize: function(opts){
		this.post = opts.post;
	},
	
})