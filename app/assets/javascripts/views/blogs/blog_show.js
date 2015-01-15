Tumblero.Views.BlogShow = Tumblero.ToggableView.extend({
	
	template: JST['blogs/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		'click button.follow-btn': "followBlog",
		"keyup input#search-tag": 'callFilterWith'
	},
	
	
	initialize: function(opts){
		Tumblero.perPage = (Tumblero.perPage || 2); // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.collection.currPage = (this.model._page || 1);
		this.listenTo(this.currentUser, 'sync', this.renderFollow);
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.collection, 'sort', this.handleSort);
		this.listenTo(this.collection, 'add', this.handleAdd);
		this.listenTo(this.collection, 'remove', this.handleRemove);
		this.listenTo(this.collection, 'sync', this.renderPosts);
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
			this.renderPosts(this.collection); // go back to beginning
			return;
		}
		
		this.callFilter("blog", queryTag);
	},
	
	// posts container
	renderPosts: function(coll){
		// avoid unless coll is a collection
		if (!coll || coll._taggings) {
			var currColl = this.collection
		} else {
			var currColl = coll;
		}

		this.addAllPosts(currColl);
	},
	
	
	// manual addition for new posts from post modal
	addNewPost: function(post){
		this.collection.add(post, { at: 0 });
	},
	
	handleAdd: function(post) {
		console.log("handleAdd", post);
		this.renderPosts();
	},
	
	handleSort: function(post) {
		console.log("handleSort", post);
		this.renderPosts();
	},
	
	handleRemove: function(post) {
		console.log("handleRemove", post);
		this.renderPosts();
	},
	
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