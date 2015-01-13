Tumblero.Utils.Sortable = {
	
	// must have this.collection
	reSortBy: function(event){
		event.preventDefault();
		var attr = $(event.currentTarget).data("sort-method");
		
		
		this.collection.comparator = function(model) {
			return -model.get(attr);
		}
		
		this.currPage = 1;
		this.collection.sort({ data: { page: this.currPage } });
		console.log("attr", attr, this.collection, this.currPage);
	},
	
}