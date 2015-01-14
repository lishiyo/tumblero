Tumblero.Models.Tagging = Backbone.Model.extend({
	urlRoot: "/api/tags/",
	
	label: function () {
		 return this.get("name");
	},
	
	initialize: function(opts){
		this.post = opts.post;
	},
	
})