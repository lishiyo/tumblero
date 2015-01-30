Tumblero.Utils.Searchable = {

	checkSearch: function(event) {
		var queryTag = $(event.currentTarget).val();
		
		if (event.which===13 && queryTag === "") {
			this.queryStr = "";
			if (Backbone.history.location.hash === "#explore") {
				Backbone.history.loadUrl(Backbone.history.fragment); //reload page
			} else {
				Backbone.history.navigate("explore", { trigger: true });
			}
			return;
		} 
		
	},
	
	initAutoCompleteBlog: function(event) {
		var queryTag = $(event.currentTarget).val();
		
		function parseRes(req, cb) {
			if (req === "") return;
			var term = $.ui.autocomplete.escapeRegex(req.term);
			var pattern = new RegExp(term, "i");
			var tags = this.model.tags;
			var filtered = _.filter(tags, function(tag) {
					return pattern.test(tag);
				});
			cb(filtered);
		}
		
	},
	
	initAutocomplete: function(event){
		
		var queryTag = $(event.currentTarget).val();
		
		function parseRes(req, cb) {
			if (req === "") return;
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
		
		if (this.$("#nav-search").length > 0) {
				this.$( "#nav-search" ).autocomplete({
					source: parseRes,
					minLength: 2,
					select: function( event, ui ) {
						var query = ui.item.label;
						query = query.split(" ").join("+");
						var url = "/explore/" + query;
						Backbone.history.navigate(url, {trigger: true});
					
					}.bind(this)
				});
			
		} else if (this.$('#main-search').length > 0) {
				this.$( "#main-search" ).autocomplete({
					source: parseRes,
					minLength: 2,
					select: function( event, ui ) {
						var query = ui.item.label;
						this.initSearchBlogs(query);
						this.initSearchPosts(query);
					}.bind(this)
				});
		}
		
	}
	
}