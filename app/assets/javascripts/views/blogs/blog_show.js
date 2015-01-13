Tumblero.Views.BlogShow = Tumblero.ToggableView.extend({
	
	template: JST['blogs/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		'click button.follow-btn': "followBlog",
		"keyup input#search-tag": 'callFilter'
	},
	
	initialize: function(opts){
		Tumblero.perPage = (Tumblero.perPage || 2); // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.collection.currPage = (this.model._page || 1);
		
		this.listenTo(this.currentUser, 'sync', this.renderFollow);
// 		this.listenTo(this.model, 'sync', this.render);
		
		this.listenTo(this.collection, 'sort', this.render);
		this.listenTo(this.collection, 'sync remove', this.render);
		this.listenTo(this.collection, "addNewPost", this.addNewPost);
		
		this.fetchCollection();
	},
	
	fetchCollection: function(){
		this.collection.fetch({ 
			data: { page: this.collection.currPage },
			success: function(coll){
				this.collection.currPage = coll._page;
				this.collection.totalPages = coll.total_pages;
				console.log("fetched Collection", this.collection.currPage, this.collection.totalPages)
			}.bind(this)
		});

	},
	
	// render this.searchResults after sync
	renderSearch: function(){
		console.log("renderSearch called", this.searchResults);
		this.removeAllSubviews();
		this.renderFollow();
		this.addAllPosts(this.searchResults);
		this.addPageNav(this.searchResults);
		this.renderFollowButton('.follow-btn');
	},
	
	callFilter: function(event){
		event.preventDefault();
		var queryTag = $(event.currentTarget).val(); // current val in input box
		if ( event.which == 13 || queryTag === "" ) { return };	
		
		this.searchResults = new Tumblero.Collections.SearchResults();
		this.listenTo(this.searchResults, "sync", this.renderSearch);
		
		var view = this;
		var searchData = { query: queryTag };
		
		this.searchResults.fetch({
			data: searchData
		});
		
// 		$.ajax({
// 			url: "/api/blogs/"+this.model.id+"/search",
// 			type: "GET",
// 			data: searchData,
// 			dataType: "json",
// 			success: function(data){
// 				var allPosts = new Tumblero.Collections.Posts(data, { blog: view.model });
// 				view.filteredCollection = allPosts.filterByTag(tag);
				
// 				view.removeAllSubviews();
				
// 				view.renderFollow();		
// 				view.addAllPosts(view.filteredCollection);
// 				view.addPageNav(view.filteredCollection);

// 				view.renderFollowButton('.follow-btn');

// 			}
// 		});
		
	},
	
	removeAllSubviews: function(){
		var view = this;
		console.log("current subviews", this.subviews());
		
		_(this.subviews()).each(function (subviews, selector) {
      view.$(selector).empty();
      _(subviews).each(function (subview) {
        view.removeSubview(selector, subview);
      });
    });
	},
	
	// manual addition for new posts from post modal
	addNewPost: function(post){
		this.collection.add(post, { at: 0 });
	},
	
	//only add posts for this.collection.currPage in this.collection
	addAllPosts: function(coll) {		
		var view = this;
		var perPage = Tumblero.perPage;
		var startPage = (coll.currPage <= 0) ? 0 : (coll.currPage - 1);
		var startPost = (startPage==0) ? 0 : (startPage * perPage);
		
		var currColl = (coll || this.collection);
		currColl = _(currColl.rest(perPage*(startPage)));
		currColl = _(currColl.first(perPage)); 
		
		console.log("addAllPosts coll", coll.currPage, currColl);
		currColl.forEach(function(post){
			view.addPostSubview(post);
		}.bind(this));
	},
	
	addPostSubview: function(post){
		var subview = new Tumblero.Views.PostShow({
      model: post,
			blog: this.model,
			currentUser: this.currentUser,
			collection: this.collection
    });
		
    this.addSubview(".posts-container", subview);
	},
	
	// pass in the collection you are showing
	addPageNav: function(coll){
		
		console.log("addPageNav", coll);
		
		var subview = new Tumblero.Views.PageNav({
			currPage: (coll.currPage || 1),
			totalPages: coll.totalPages,
			blog: this.model,
			collection: coll,
			parentView: this
		});
		
		this.addSubview('#pagination-nav', subview);
	},
	
	renderFollow: function(){
		// no btnId passed in = default
		this.setFollowState();
	},
	
	
	render: function(){
		console.log("render! curr coll", this.collection);
			
		this.renderFollow();		
		
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
		this.addAllPosts(this.collection);
		this.addPageNav(this.collection);
		
		this.renderFollowButton('.follow-btn');
		
    return this;
	}
	
	
});


_.extend(Tumblero.Views.BlogShow.prototype, Tumblero.Utils.Sortable);