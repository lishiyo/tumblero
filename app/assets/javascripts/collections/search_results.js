Tumblero.Collections.SearchResults = Backbone.Collection.extend({
	
	url: function(){
		if (this._searchType === "single") {
			// search through main navbar
			if (this._searchModel === "post") {
				return "/api/search/posts"
			} else if (this._searchModel === "blog") {
				return "/api/search/blogs"
			} else { // search on blog or dashboard page
				return "/api/search";
			}
		} else { // multisearch
			return "/api/search/all";
		}
	},
	
	initialize: function(models, opts){
		this._searchType = (opts.searchType || "multi");
		this._searchModel = (opts.searchModel || null);
	},
	
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
		this.total_pages = resp.total_pages;
		return resp.results;
	}

});