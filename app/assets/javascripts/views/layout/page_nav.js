Tumblero.Views.PageNav = Backbone.View.extend({
	
	template: JST['layout/page_nav'],
	
	events: {
		'click #previous-page': "previousPage",
		'click #next-page': "nextPage"
	},
	
	initialize: function(opts){
		this.blog = opts.blog;
		this.totalPages = opts.totalPages;
		this.collection = opts.collection;
		this.currPage = opts.currPage;
	},
	
	previousPage: function(){
		var newPage = (this.currPage === 0) ? 0 : (this.currPage - 1);
		
		this.collection.fetch({
			remove: true, // merge this page with the rest of the collection
			data: { page: newPage },
			success: function() {
				console.log("fetched prevpage", newPage);
			}
		});
	},
	
	nextPage: function(){
		var newPage = (this.currPage === this.totalPages) ? this.currPage : (this.currPage + 1);
		
		this.collection.fetch({
			remove: true, // merge this page with the rest of the collection
			data: { page: newPage },
			success: function() {
				console.log("fetched nextPage", newPage);
			}
		});
	},
	
	render: function(){
		var content = this.template({ currPage: this.currPage });
		this.$el.html(content);
		
		return this;
	}
});
