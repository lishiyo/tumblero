Tumblero.Views.DashboardShow = Tumblero.ToggableView.extend({
	
	template: JST['dashboard/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		"click button.full-post-modal": "openPostModal"
	},
	
	initialize: function(opts){
		Tumblero.perPage = (Tumblero.perPage || 2); // set to a default
		
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.currPage = opts.currPage || 1;
		
		this.collection.fetch({ 
			data: { page: this.currPage },
			success: function(coll){
				this.currPage = coll.page;
				this.totalPages = coll.total_pages;
			}.bind(this)
		});
		
		this.listenTo(this.currentUser, 'sync', this.render);
		
		this.listenTo(this.model, 'sync change', this.render);
		this.listenTo(this.collection, 'sort', this.render);
		this.listenTo(this.collection, 'remove sync', this.render);
// 		this.listenTo(this.collection, 'add', this.render);
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

	
// 	addPost: function(post){
// // 		this.addPostSubview(post);
// 		this.render();
// 	},
	
	
	//only add posts for this.currPage
	addAllPosts: function() {		
		var view = this;
		var perPage = Tumblero.perPage;
		var startPage = (this.currPage <= 0) ? 0 : (this.currPage - 1);
		var startPost = (startPage==0) ? 0 : (startPage * perPage);
		
		var coll = _(this.collection.rest(perPage*(startPage)));
		coll = _(coll.first(perPage)); 
		
		console.log("coll is", this.currPage, startPost, coll);
		coll.forEach(function(post){
			view.addPostSubview(post);
		}.bind(this));
	},
	
	addPostSubview: function(post){
		var subview = new Tumblero.Views.PostShow({
      model: post,
			blog: this.model,
			currentUser: this.currentUser
    });
		
    this.addSubview(".posts-container", subview);
	},
	
	render: function(){
		console.log("curr coll in dash", this.collection);
		
		this.setFollowState();
		
		var content = this.template({ 
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
		this.addAllPosts();
		this.addPageNav();

		this.renderLikeButton(this.$('.like-btn'));
		this.renderFollowButton(this.$('.follow-btn'));
		
    return this;
	}
	
});


_.extend(Tumblero.Views.DashboardShow.prototype, Tumblero.Utils.Sortable);