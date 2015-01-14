// searching in main header => /explore/One+Direction
Tumblero.Views.ExploreTags = Backbone.CompositeView.extend({
	
	template: JST["searches/tags"],
	
	events: {
// 		"click #main-search-btn": "searchMain",
		"click .next-page": "nextPage"
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
		
		this.initSearchBlogs();
		this.initSearchPosts();
		
		this.listenTo(this.searchResBlogs, "sync", this.renderBlogResults);
		this.listenTo(this.searchResPosts, "sync", this.renderPostResults);
	},
	
	searchMain: function (event) {
		event.preventDefault();
		this.queryStr = this.$("#main-search").val();
		
		this.initSearchBlogs();
		this.initSearchPosts();
	},
	
	initSearchBlogs: function(){
		this.searchResBlogs._query = this.queryStr;
		this.searchResBlogs.fetch({
			data: { query: this.searchResBlogs._query },
// 			success: function(data){
// 				console.log("initSearchBlogs success", data);
// 			}
		});
	},
	
	initSearchPosts: function(){
		this.searchResPosts._query = this.queryStr;
		this.searchResPosts.fetch({
			data: { query: this.searchResPosts._query },
// 			success: function(data){
// 				console.log("initSearchPpost success", data);
// 			}
		});
	},
	
	renderBlogResults: function(){
		this.removeSubviewsFor(this.blogsCont);
		
		this.searchResBlogs.each(function (model) {
			this.addBlogSubview(model);
		}.bind(this));
	},
	
	renderPostResults: function () {
		this.removeSubviewsFor(this.postsCont);
	
		this.searchResPosts.each(function (model) {
			this.addPostSubview(model)
// 			container.append("<li>" + model.escape('content') + "</li>")
		}.bind(this));
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
	
	render: function () {
		var content = this.template({ 
			query: this.queryStr
		});	
		
		this.$el.html(content);
		
		this.initAutocomplete();
		return this;
	},
	
// 	nextPage: function (event) {
// 		if (this.searchResPosts._page >= this.searchResPosts.total_pages) {
// 			event.preventDefault();
// 			return;
// 		}
		
// 		this.searchResults.fetch({
// 			data: {
// 				query: this.searchResults._query,
// 				page: (this.searchResults._page || 1) + 1
// 			}
// 		});
// 	}
	
});

_.extend(Tumblero.Views.ExploreTags.prototype, Tumblero.Utils.Sortable);
_.extend(Tumblero.Views.ExploreTags.prototype, Tumblero.Utils.Searchable);