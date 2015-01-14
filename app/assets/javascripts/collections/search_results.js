Tumblero.Collections.SearchResults = Backbone.Collection.extend({
	
	url: "api/search",
	
	model: function (attrs) {
		var type = attrs._type;
		delete attrs._type;
		
		if (type === "Post") {
			return new Tumblero.Models.Post(attrs, { parse: true });
		} else if (type === "Blog") {
			return new Tumblero.Models.Blog(attrs, { parse: true });
		}
	},
	
	parse: function (resp) {
		this._page = resp._page;
		
		return resp.results;
	}

});