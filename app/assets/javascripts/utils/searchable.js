Tumblero.Utils.Searchable = {

	initAutocomplete: function(){
		view = this;
		
		function parseRes(req, cb) {
			if(req == "") return;
			var term = $.ui.autocomplete.escapeRegex(req.term);
			var pattern = new RegExp(term, "i");
			
			$.ajax({
				url: "/api/tags/all",
				type: "GET",
				dataType: "json",
				success: function(tags){
					var filtered = _.filter(tags, function(tag) {
						return pattern.test(tag);
					});
					console.log("got tags", tags, filtered);
					cb(filtered);
				}
			})
		};
		
		$( "#main-search" ).autocomplete({
      source: parseRes,
      minLength: 2,
      select: function( event, ui ) {
				console.log("selected", ui, ui.item);
				var query = ui.item.label;
				this.queryStr = query;
				
				this.initSearchBlogs();
				this.initSearchPosts();
      }.bind(this)
    });
	},
	
}