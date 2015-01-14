Tumblero.Utils.Searchable = {

	checkSearch: function(event) {
		var queryTag = $(event.currentTarget).val();
		console.log("hit checksearch");
		if (event.which===13 && queryTag === "") {
			console.log("hit 13")
			this.queryStr = "";
			Backbone.history.navigate("explore", { trigger: true })
// 			this.render();
			return;
// 		} else if (event.which === 13) {
// 			return;
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
			console.log("got tags", tags, filtered);
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
			console.log("in nav search");
				this.$( "#nav-search" ).autocomplete({
					source: parseRes,
					minLength: 2,
					select: function( event, ui ) {
						var query = ui.item.label;
						query = query.split(" ").join("+");
						var url = "/explore/" + query;
						console.log("query is", url);
						Backbone.history.navigate(url, {trigger: true});
					
					}.bind(this)
				});
			
		} else if (this.$('#main-search').length > 0) {
			console.log("in mainsearch");
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