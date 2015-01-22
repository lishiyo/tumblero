Tumblero.Utils.Sortable = {
	
	// must have this.collection
	reSortBy: function(event){
		event.preventDefault();
		var attr = $(event.currentTarget).data("sort-method");
		
		this.collection.comparator = function(model) {
			if (attr === "created_at") {
				var date = model.get(attr);
				return -Date.parse(date);
			} else {
				return -model.get(attr);
			}
		}
		
		// reset current page
		this.collection.currPage = 1;
		this.collection.sort({ data: { page: this.collection.currPage } });
		
	},
	
	fetchCollection: function(){
		this.collection.fetch({ 
			data: { page: this.collection.currPage },
			success: function(coll){
				this.collection.currPage = coll._page;
				this.collection.totalPages = coll.total_pages;
			}.bind(this)
		});
	},
	
	// render this.searchResults for single searches
	renderSearch: function(){
		console.log("renderSearch called", this.searchResults);		
		this.renderPosts(this.searchResults);
	},
	
	callFilter: function(type, queryTag){
		var view = this;
		this.searchResults = new Tumblero.Collections.SearchResults([], {
			searchType: "single"
		});
		
		if (type === "blog") {
			var searchData = { query: queryTag, blog_id: view.model.id };
		} else { // dashboard
			var searchData = { query: queryTag, dashboard_id: view.model.id };
		}
		
		this.searchResults.fetch({
			data: searchData,
			success: function(){
				view.renderSearch();
			}
		});
		
	},
	
	addAllPosts: function(coll) {		
		console.log("addAllPosts", coll);
		this.removeSubviewsFor(this.postsCont);
		this.removeSubviewsFor("#pagination-nav");
		
		var currColl = (coll || this.collection);
		var view = this;
		var perPage = Tumblero.perPage;
		var startPage = (coll.currPage <= 0) ? 0 : (coll.currPage - 1);
		var startPost = (startPage==0) ? 0 : (startPage * perPage);
			
		currColl = _(currColl.rest(perPage*(startPage)));
		currColl = _(currColl.first(perPage)); 
		
		currColl.forEach(function(post){
			view.addPostSubview(post);
		}.bind(this));
		
		this.addPageNav(this.collection);
	},
	
}