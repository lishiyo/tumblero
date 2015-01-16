Tumblero.Views.DashboardShow = Tumblero.ToggableView.extend({
	
	template: JST['dashboard/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		"click button.full-post-modal": "openPostModal",
		"keyup input#search-tag": 'callFilterWith'
	},
	
	initialize: function(opts){
		Tumblero.perPage = (Tumblero.perPage || 4); // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.collection.currPage = (this.model._page || 1);
		
		this.listenTo(this.currentUser, 'sync', this.renderFollow);
		this.listenTo(this.model, 'sync', this.renderDash);
		this.listenTo(this.collection, 'sort sync', this.renderPosts);
		this.listenTo(this.collection, 'add', this.renderPosts);
		
		this.postsCont = '.posts-container';
		this.paginationCont = '#pagination-nav';
		
		view = this;
		
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
	
	callFilterWith: function(event) {
		event.preventDefault();
		var queryTag = $(event.currentTarget).val(); // current val in input box
		if ( event.which == 13 ) { 
			return;
		} else if (queryTag === "") {
			this.renderPosts(this.collection); 
			return;
		}
		
		this.callFilter("dashboard", queryTag);
	},

	addPostSubview: function(post){
		console.log("addPostsunview")
		
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
	
	renderPosts: function(coll){
		if (!coll || coll._taggings) {
			var currColl = this.collection
		} else {
			var currColl = coll;
		}
		
		console.log("rendering posts")
		this.addAllPosts(currColl);
	},
	
	renderDash: function(){
		console.log("render dash");
		
		this.renderFollow();
		this.renderFollowButton(this.$('.follow-btn'));
	},
	
	render: function(){
		this.renderFollow();
		var content = this.template({ 
			dashboard: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);

		console.log("render main")
		this.renderFollowButton(this.$('.follow-btn'));
		
    return this;
	}
	
});


_.extend(Tumblero.Views.DashboardShow.prototype, Tumblero.Utils.Sortable);