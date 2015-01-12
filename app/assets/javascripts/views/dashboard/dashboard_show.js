Tumblero.Views.DashboardShow = Tumblero.ToggableView.extend({
	
	template: JST['dashboard/show'],
	events: {
		'click .re-sort': 'reSortBy'
	},
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		this.listenTo(this.currentUser, 'sync', this.render);
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.collection, 'sort', this.render);
		this.listenTo(this.collection, 'remove', this.render);
		this.listenTo(this.collection, 'add', this.render);
		
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

		this.renderLikeButton(this.$('.like-btn'));
		this.renderFollowButton(this.$('.follow-btn'));
		
		// set up like and follow buttons
// 		$("button.like-btn").likeToggle();
// 		$("button.follow-btn").followToggle();
		
    return this;
	}
	
});


_.extend(Tumblero.Views.DashboardShow.prototype, Tumblero.Utils.Sortable);