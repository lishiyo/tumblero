// searching in main header => /explore/Star+Trek
Tumblero.Views.ExploreTags = Tumblero.ToggableView.extend({
	
	template: JST["searches/tags"],
	
	events: {
// 		"click #main-search-btn": "searchMain",
		"click .next-page": "nextPage",
		'focus #main-search': 'initAutocomplete',
		'keyup #main-search': 'checkSearch',
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
		this.currentUser = opts.currentUser;
		this.searchResPosts.cont = '#posts-results';
		this.searchResBlogs.cont = '#blogs-results';
		
		this.listenTo(this.searchResBlogs, "sync remove sort", this.renderBlogResults);
		this.listenTo(this.searchResPosts, "sync remove sort", this.renderPostResults);
		
// 		this.currentUser.fetch();
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
			data: { 
				query: this.searchResBlogs._query,
				page: (this.searchResBlogs._page || 1)
			},
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
		this.searchResBlogs.currPage = this.searchResBlogs._page;
		this.searchResBlogs.totalPages = this.searchResBlogs.total_pages;
		this.addBlogsPage(this.searchResBlogs)
	},
	
	renderPostResults: function () {
		this.collection = this.searchResPosts;
		this.collection.currPage = this.searchResPosts._page;
		this.collection.totalPages = this.searchResPosts.total_pages;
		// callback to make sure all posts have been added before using masonry
		this.addAllPosts(this.collection, function(res){
			if (res === "finished") {
				console.log("initiating masonry");
				this.initMasonry();
			}
		}.bind(this));
	},
	
	initMasonry: function(){
		var container = document.querySelector(this.searchResPosts.cont);
		var postCont = '.post-show';
		
		if ($(postCont).length === this.searchResPosts.length) {
				var masonry = new Masonry( container, {
	// 			columnWidth: 300,
				itemSelector: '.post-show',
				gutter: 20
			});
		}
	},
	
	addBlogSubview: function(blog) {
		var subview = new Tumblero.Views.BlogProfile({
			model: blog,
			currentUser: (this.currentUser || Tumblero.current_user),
		});
		
		this.addSubview(this.searchResBlogs.cont, subview);
	},
	
	addPostSubview: function(post) {
		var subview = new Tumblero.Views.PostShow({
			model: post,
			currentUser: (this.currentUser || Tumblero.current_user),
			parentView: this
		});
		
		this.addSubview(this.searchResPosts.cont, subview);	
	},
	
	addBlogPageNav: function(coll){		
		var subview = new Tumblero.Views.PageNav({
			currPage: coll._page,
			totalPages: coll.total_pages,
			collection: coll,
			query: coll._query,
			blogsCont: coll.cont,
		});
		
		this.addSubview('#pagination-nav-blog', subview);
	},
	
	// pass in the collection you are showing
	addPageNav: function(coll){
		var subview = new Tumblero.Views.PageNav({
			currPage: (coll.currPage || coll._page),
			totalPages: (coll.totalPages || coll.total_pages),
			collection: coll,
			query: coll._query,
			postsCont: coll.cont,
		});
		
		this.addSubview('#pagination-nav', subview);
	},
	
	render: function () {		
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