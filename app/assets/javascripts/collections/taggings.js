Tumblero.Collections.Taggings = Backbone.Collection.extend({
	url: function(){
		return this.post.url() + "/taggings.json"
	},
	
	model: Tumblero.Models.Tagging,
	
	initialize: function(opts){
		this.post = opts.post;
	},
	

	
	search: function(letters){
		if(letters == "") return this;
 
		var pattern = new RegExp(letters,"gi");
		
		return _(this.filter(function(data) {
		  	return pattern.test(data.get("name"));
		}));
	}
	
});