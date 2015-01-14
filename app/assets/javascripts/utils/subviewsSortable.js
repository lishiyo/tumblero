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
				console.log("fetched Collection", this.collection.currPage, this.collection.totalPages)
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
	
// 	filterBy: function(tag) {
		
// 		var view = this;
// 		$.ajax({
// 			url: "/api/blogs/"+this.model.id+"/all_posts",
// 			type: "GET",
// 			dataType: "json",
// 			success: function(data){
// 				var allPosts = new Tumblero.Collections.Posts(data, { blog: view.model });
// 				view.filteredCollection = allPosts.filterByTag(tag);
// 				console.log("current tag", tag, "allPosts", view.filteredCollection);
		
// 				return view.filteredCollection;
// 			}
// 		});
		
// 	}
}