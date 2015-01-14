Tumblero.Views.BlogShow = Tumblero.ToggableView.extend({
	
	template: JST['blogs/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		'click button.follow-btn': "followBlog",
		"keyup input#search-tag": 'callFilterWith'
	},
	
	
// 	testTypeahead: function(){
		
// 		typeahead = new Backbone.Typeahead({
// 			collection: this.collection
// 		});
		
// 		typeahead.setElement('#typeahead-results').render();
		
// 	},
	
	initialize: function(opts){
		Tumblero.perPage = (Tumblero.perPage || 2); // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.collection.currPage = (this.model._page || 1);
		
// 		this.listenTo(this.currentUser, 'sync', this.renderFollow);
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.collection, 'sync remove sort', this.renderPosts);
		this.listenTo(this.collection, "addNewPost", this.addNewPost);
		
		this.postsCont = '.posts-container';
		this.paginationCont = '#pagination-nav';
		
		this.fetchCollection();
	},
	
	callFilterWith: function(event) {
		event.preventDefault();
		var queryTag = $(event.currentTarget).val(); // current val in input box
		
		if ( event.which == 13 ) { 
			return;
		} else if (queryTag === "") {
			this.render(); // go back to beginning
			return;
		}
		
		this.callFilter("blog", queryTag);
	},
	
	// manual addition for new posts from post modal
	addNewPost: function(post){
		this.collection.add(post, { at: 0 });
	},
	
	//only add posts for this.collection.currPage in this.collection
// 	addAllPosts: function(coll) {		
// 		this.removeSubviewsFor(this.postsCont);
// 		this.removeSubviewsFor("#pagination-nav");
		
// 		var currColl = (coll || this.collection);
// 		var view = this;
// 		var perPage = Tumblero.perPage;
// 		var startPage = (coll.currPage <= 0) ? 0 : (coll.currPage - 1);
// 		var startPost = (startPage==0) ? 0 : (startPage * perPage);
			
// 		currColl = _(currColl.rest(perPage*(startPage)));
// 		currColl = _(currColl.first(perPage)); 
		
// 		currColl.forEach(function(post){
// 			view.addPostSubview(post);
// 		}.bind(this));
		
// 		this.addPageNav(this.collection);
// 	},
	
	addPostSubview: function(post){
		var subview = new Tumblero.Views.PostShow({
      model: post,
			blog: this.model,
			currentUser: this.currentUser,
			collection: this.collection
    });
		
    this.addSubview(this.postsCont, subview);
	},
	
	// pass in the collection you are showing
	addPageNav: function(coll){
		
		var subview = new Tumblero.Views.PageNav({
			currPage: (coll.currPage),
			totalPages: coll.totalPages,
			blog: this.model,
			collection: coll
		});
		
		this.addSubview('#pagination-nav', subview);
	},
	
	renderFollow: function(){
		// no btnId passed in = default
		this.setFollowState();
	},
	
	// posts container
	renderPosts: function(){
		this.addAllPosts(this.collection);
	},
	
	render: function(){	
		this.renderFollow();		
		
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
		
		this.renderFollowButton('.follow-btn');
// 		this.renderPosts(this.collection);
// 		this.addPageNav(this.collection);
		
    return this;
	}
	
	
});


_.extend(Tumblero.Views.BlogShow.prototype, Tumblero.Utils.Sortable);