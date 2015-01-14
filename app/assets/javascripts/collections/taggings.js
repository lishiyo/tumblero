Tumblero.Collections.Taggings = Backbone.Collection.extend({
	url: function(){
		if (this.post) {
			return this.post.url() + "/taggings.json"
		} else {
			return "/tags/all"
		}
	},
	
	model: Tumblero.Models.Tagging,
	
	initialize: function(opts){
		this.post = (opts.post || null);
	},
	
	search: function(letters){
		if(letters == "") return this;
 
		var pattern = new RegExp(letters,"gi");
		
		return _(this.filter(function(data) {
		  	return pattern.test(data.get("name"));
		}));
	}
	
});