Tumblero.Utils.Sortable = {
	
	// must have this.collection
	reSortBy: function(event){
		event.preventDefault();
		var attr = $(event.currentTarget).data("sort-method");
		console.log("attr", attr);
		
		this.collection.comparator = function(model) {
			return model.get(attr);
		}
		this.collection.sort();
	},
	
}