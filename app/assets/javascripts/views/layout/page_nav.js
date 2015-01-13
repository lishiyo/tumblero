Tumblero.Views.PageNav = Backbone.View.extend({
	
	template: JST['layout/page_nav'],
	
	events: {
		'click #previous-page': "previousPage",
		'click #next-page': "nextPage"
	},
	
	initialize: function(opts){
		this.blog = opts.blog;
		this.parentView = opts.parentView;
		this.totalPages = opts.totalPages;
		this.collection = opts.collection;
		this.currPage = opts.currPage;
	},
	
	previousPage: function(e){
		e.preventDefault();
		if (this.currPage <= 0 ) { return; }
		
		var newPage = (this.currPage - 1);
		
		this.collection.fetch({
			remove: false, // merge this page with the rest of the collection
			data: { page: newPage },
// 			success: function() {
// 				console.log("fetched prevpage", newPage);
// 				this.currPage = newPage;
// 				this.parentView.currPage = newPage;
// 			}.bind(this)
		});
		
		this.currPage = newPage;
				this.parentView.currPage = newPage;
	},
	
	nextPage: function(e){
		e.preventDefault();
		console.log("next", this.currPage, this.totalPages);
		if (this.currPage >= this.totalPages ) { return; }
		
		var newPage = (this.currPage + 1);
		
		this.collection.fetch({
			remove: false, // merge this page with the rest of the collection
			data: { page: newPage },
// 			success: function() {
// 				console.log("fetched nextPage", newPage);
// 				this.currPage = newPage;
// 				this.parentView.currPage = newPage;
// 			}.bind(this)
		});
		
		this.currPage = newPage;
		this.parentView.currPage = newPage;
	},
	
	render: function(){
		var content = this.template({ currPage: this.currPage });
		this.$el.html(content);
		
		return this;
	}
});
