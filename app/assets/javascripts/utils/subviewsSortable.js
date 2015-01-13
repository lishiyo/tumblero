Tumblero.Utils.Sortable = {
	
	// must have this.collection
	reSortBy: function(event){
		event.preventDefault();
		var attr = $(event.currentTarget).data("sort-method");
		this.collection.comparator = function(model) {
			return -model.get(attr);
		}
		
		// reset current page
		this.collection.currPage = 1;
		this.collection.sort({ data: { page: this.collection.currPage } });
		
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