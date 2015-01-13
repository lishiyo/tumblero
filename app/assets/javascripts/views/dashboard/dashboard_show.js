Tumblero.Views.DashboardShow = Tumblero.ToggableView.extend({
	
	template: JST['dashboard/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		"click button.full-post-modal": "openPostModal",
		"keyup input#search-tag": 'callFilter'
	},
	
	initialize: function(opts){
		Tumblero.perPage = (Tumblero.perPage || 2); // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.collection.currPage = (this.model._page || 1);
		
		this.listenTo(this.currentUser, 'sync', this.render);	
		this.listenTo(this.model, 'sync change', this.render);
		this.listenTo(this.collection, 'sort remove sync', this.render);
// 		this.listenTo(this.collection, 'add', this.render);

		this.fetchCollection();
	},
	
	openPostModal: function(event){
		event.preventDefault();
		
		var startTab = ($(event.currentTarget).data("tab-num") || 1),
				post = new Tumblero.Models.Post();

		var newPostFull = new Tumblero.Views.NewPostFull({
			model: post,
			currentUser: this.currentUser,
			collection: this.collection
		});

		$('.modal-container').html(newPostFull.render().$el);

		newPostFull.setActive({ tabNum: startTab });
		
	},

	//only add posts for this.collection.currPage in this.collection
	addAllPosts: function(coll) {		
		var currColl = (coll || this.collection);
		var view = this;
		var perPage = Tumblero.perPage;
		var startPage = (currColl.currPage <= 0) ? 0 : (currColl.currPage - 1);
		var startPost = (startPage==0) ? 0 : (startPage * perPage);
		
		currColl = _(currColl.rest(perPage*(startPage)));
		currColl = _(currColl.first(perPage)); 
		
		console.log("coll is", currColl.currPage, currColl);
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
	
	
	addPageNav: function(coll){
		var coll = (coll || this.collection);
		
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
		console.log("curr coll in dash", this.collection);
		
		this.renderFollow();
		
		var content = this.template({ 
			dashboard: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
		this.addAllPosts(this.collection);
		this.addPageNav(this.collection);

// 		this.renderLikeButton(this.$('.like-btn'));
		this.renderFollowButton(this.$('.follow-btn'));
		
    return this;
	}
	
});


_.extend(Tumblero.Views.DashboardShow.prototype, Tumblero.Utils.Sortable);