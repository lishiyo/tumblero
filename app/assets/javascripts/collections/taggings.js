Tumblero.Collections.Taggings = Backbone.Collection.extend({
	url: function(){
		return this.post.url() + "/taggings.json"
	},
	
	model: Tumblero.Models.Tagging,
	
	initialize: function(opts){
		this.post = opts.post;
	},
	
});