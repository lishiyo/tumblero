Tumblero.Views.BlogShow = Tumblero.ToggableView.extend({
	
	template: JST['blogs/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		'click button.follow-btn': "followBlog"
	},
	
	initialize: function(opts){
		this.perPage = 2; // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.currPage = this.currPage || 1;
		
		this.listenTo(this.currentUser, 'sync', this.renderFollow);
// 		this.listenTo(this.model, 'sync', this.render);
		
		this.listenTo(this.collection, 'sort', this.render);
		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, "addNewPost", this.addNewPost);
		
		this.collection.fetch({ 
			data: { page: this.currPage },
			success: function(coll){
				this.currPage = coll.page;
				this.totalPages = coll.total_pages;
			}.bind(this)
		});
		
	},
	
	// manual addition
	addNewPost: function(post){
		this.collection.add(post, { at: 0 });
		console.log("triggered add new post", post, this.collection);
// 		this.render();
// 		this.addPostSubview(post);
	},
	
	//only add posts for this.currPage
	addAllPosts: function() {		
		var view = this;
		var perPage = this.perPage;
		var startPage = (this.currPage <= 0) ? 0 : (this.currPage - 1);
		var startPost = (startPage==0) ? 0 : (startPage * perPage);
		
		var coll = _(this.collection.rest(perPage*(startPage)));
		coll = _(coll.first(perPage)); 
		
		console.log("coll is", this.currPage, startPage, coll);
		coll.forEach(function(post){
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
	
	addPageNav: function(){
		
		var subview = new Tumblero.Views.PageNav({
			currPage: (this.currPage || 1),
			totalPages: this.totalPages,
			blog: this.model,
			collection: this.collection,
			parentView: this
		});
		
		this.addSubview('#pagination-nav', subview);
	},
	
	renderFollow: function(){
		// no btnId passed in = default
		this.setFollowState();
	},
	
	
	render: function(){
		console.log("curr coll", this.collection);
			
		this.renderFollow();		
		
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
		this.addAllPosts();
		this.addPageNav();
		
//     this.attachSubviews();
		this.renderFollowButton('.follow-btn');
		
    return this;
	}
	
	
});


_.extend(Tumblero.Views.BlogShow.prototype, Tumblero.Utils.Sortable);