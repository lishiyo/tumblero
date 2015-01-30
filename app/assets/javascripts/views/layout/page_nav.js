Tumblero.Views.PageNav = Backbone.View.extend({
	
	template: JST['layout/page_nav'],
	
	events: {
		'click #previous-page': "previousPage",
		'click #next-page': "nextPage"
	},
	
	initialize: function(opts){
		this.blog = (opts.blog || null);
		this.collection = opts.collection;
		this.totalPages = (opts.totalPages || this.collection.totalPages);
		this.currPage = (opts.currPage || this.collection.currPage);
		this.query = (opts.query || null);
// 		this.cont = (opts.postsCont || opts.blogsCont);
	},
	
	previousPage: function(e){
		e.preventDefault();
		if (this.currPage <= 1 ) { return; }
		
		var newPage = (this.currPage - 1);
		
		this.collection.fetch({
			remove: false, // merge this page with the rest of the collection
			data: { 
				page: newPage,
				query: this.query
			},
// 			success: function() {
// 				console.log("fetched prevpage", newPage);
// 				this.currPage = newPage;
// 				this.parentView.currPage = newPage;
// 			}.bind(this)
		});
		
		this.currPage = newPage;
		this.collection.currPage = newPage;
	},
	
	nextPage: function(e){
		e.preventDefault();
		
		if ( (typeof this.totalPages === "undefined") || this.currPage >= this.totalPages ) { 
				return; }
				
		var newPage = (this.currPage + 1);
		
		this.collection.fetch({
			remove: false, // merge this page with the rest of the collection
			data: { 
				page: newPage,
				query: this.query
			},
		});
		
		this.currPage = newPage;
		this.collection.currPage = newPage;
	},
	
	render: function(){
		var content = this.template({ currPage: this.currPage });
		this.$el.html(content);
		
		return this;
	}
});
