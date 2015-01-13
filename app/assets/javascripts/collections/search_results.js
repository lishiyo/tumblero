Tumblero.Collections.SearchResults = Backbone.Collection.extend({
	
	url: "api/search",
	
	model: function (attrs) {
		var type = attrs._type;
		delete attrs._type;
		
		if (type === "Post") {
			return new BackboneAuthDemo.Models.Post(attrs);
		} else if (type === "Blog") {
			return new BackboneAuthDemo.Models.Blog(attrs);
		}
	},
	
	parse: function (resp) {
		this._page = resp._page;
		
		return resp.results;
	}

});