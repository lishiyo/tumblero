// searching in main header => /explore/One+Direction
Tumblero.Views.ExploreTags = Backbone.CompositeView.extend({
	
	template: JST["searches/tags"],
	
	events: {
// 		"click #main-search-btn": "searchMain",
		"click .next-page": "nextPage",
		'focus #main-search': 'initAutocomplete',
		'keyup #main-search': 'checkSearch'
	},
	
	initialize: function (opts) {
		this.searchResBlogs = new Tumblero.Collections.SearchResults([], {
			searchType: "single",
			searchModel: "blog"
		});
		this.searchResPosts = new Tumblero.Collections.SearchResults([], {
			searchType: "single",
			searchModel: "post"
		});
		
		this.$container = $('#main-search-container');
		this.queryStr = opts.queryStr; // initial querystring
		this.blogsCont = '#blogs-results';
		this.postsCont = '#posts-results';
		
		this.listenTo(this.searchResBlogs, "sync", this.renderBlogResults);
		this.listenTo(this.searchResPosts, "sync remove sort", this.renderPostResults);
		
	},
	
	searchMain: function (event) {
		event.preventDefault();
		this.queryStr = this.$("#main-search").val();
		
		this.initSearchBlogs(this.queryStr);
		this.initSearchPosts(this.queryStr);
	},
	
	initSearchBlogs: function(query){
		this.searchResBlogs.reset();
		this.searchResBlogs._query = query;
		this.searchResBlogs.fetch({
			data: { query: this.searchResBlogs._query },
		});
	},
	
	initSearchPosts: function(query){
		this.searchResPosts.reset();
		this.searchResPosts._query = query;
		this.searchResPosts.fetch({
			data: { 
				query: this.searchResPosts._query,
				page: (this.searchResPosts._page || 1)
			}
		});
	},
	
	renderBlogResults: function(){
		this.removeSubviewsFor(this.blogsCont);
		
		this.searchResBlogs.each(function (model) {
			this.addBlogSubview(model);
		}.bind(this));
	},
	
	renderPostResults: function () {
		this.collection = this.searchResPosts;
		this.collection.currPage = this.searchResPosts._page;
		this.collection.totalPages = this.searchResPosts.total_pages;
		this.addAllPosts(this.collection);
	},
	
	
	addBlogSubview: function(blog) {
		var subview = new Tumblero.Views.BlogProfile({
			model: blog,
			currentUser: (this.currentUser || Tumblero.current_user),
		});
		
		this.addSubview(this.blogsCont, subview);
	},
	
	addPostSubview: function(post) {
		var subview = new Tumblero.Views.PostShow({
			model: post,
			currentUser: (this.currentUser || Tumblero.current_user),
		});
		
		this.addSubview(this.postsCont, subview);
	},
	
	// pass in the collection you are showing
	addPageNav: function(coll){
		
		var subview = new Tumblero.Views.PageNav({
			currPage: (coll.currPage),
			totalPages: coll.totalPages,
			collection: coll,
			query: coll._query,
			postsCont: this.postsCont,
		});
		
		this.addSubview('#pagination-nav', subview);
	},
	
	render: function () {
		console.log("rendering with", this.queryStr);
		
		var content = this.template({ 
			query: this.queryStr
		});	
		
		this.$el.html(content);
		this.initSearchBlogs(this.queryStr);
		this.initSearchPosts(this.queryStr);
		
		return this;
	},
	
});

_.extend(Tumblero.Views.ExploreTags.prototype, Tumblero.Utils.Sortable);
_.extend(Tumblero.Views.ExploreTags.prototype, Tumblero.Utils.Searchable);