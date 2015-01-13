Tumblero.Views.DashboardShow = Tumblero.ToggableView.extend({
	
	template: JST['dashboard/show'],
	
	events: {
		'click .re-sort': 'reSortBy',
		"click button.full-post-modal": "openPostModal"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.currPage = opts.currPage || 1;
		
		this.collection.fetch({ data: { page: this.currPage }});
		
		this.listenTo(this.currentUser, 'sync', this.render);
		
		this.listenTo(this.model, 'sync change', this.render);
		this.listenTo(this.collection, 'sort', this.render);
		this.listenTo(this.collection, 'remove sync', this.render);
		this.listenTo(this.collection, 'add', this.render);
	},
	
	addPageNav: function(){
		var subview = new Tumblero.Views.PageNav({
			currPage: (this.currPage || 1),
			totalPages: this.totalPages,
			blog: this.model,
			collection: this.collection
		});
		
		this.addSubview('#pagination-nav', subview);
	},
	
	openPostModal: function(event){
		event.preventDefault();
		
		var startTab = ($(event.currentTarget).data("tab-num") || 1),
				post = new Tumblero.Models.Post();

		var newPostFull = new Tumblero.Views.NewPostFull({
			model: post,
			currentUser: this.currentUser
		});

		$('.modal-container').html(newPostFull.render().$el);

		newPostFull.setActive({ tabNum: startTab });
		
	},

	
	addPost: function(post){
// 		this.addPostSubview(post);
		this.render();
	},
	
	addAllPosts: function() {		
		// add subviews for posts
		this.model.posts().each(function(post){
			this.addPostSubview(post);
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
// 		var isFollowed = this.currentUser.followStateFor(this.model.id);
// 		var followState = ((isFollowed) ? "followed" : "unfollowed");
		
		this.setFollowState();
		
		var content = this.template({ 
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
//     this.attachSubviews();
		this.addAllPosts();
		this.addPageNav();

		this.renderLikeButton(this.$('.like-btn'));
		this.renderFollowButton(this.$('.follow-btn'));
		
		// set up like and follow buttons
// 		$("button.like-btn").likeToggle();
// 		$("button.follow-btn").followToggle();
		
    return this;
	}
	
});


_.extend(Tumblero.Views.DashboardShow.prototype, Tumblero.Utils.Sortable);