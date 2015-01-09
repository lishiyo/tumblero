Tumblero.Views.DashboardShow = Backbone.CompositeView.extend({
	
	template: JST['dashboard/show'],
	events: {
		
	},
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		
		this.listenTo(this.model, 'sync', this.render);

		this.listenTo(this.model.posts(), 'sync remove', this.render);
		this.listenTo(this.model.posts(), 'add', this.addPost);
		
		console.log("initialize", this.model, this.model.posts());
		// add subviews for posts
		this.model.posts().each(function(post){
			this.addPostSubview(post);
		}.bind(this));
		
	},
	
	addPost: function(post){
		console.log("adding post subview")
		this.addPostSubview(post);
		this.render();
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
		var isFollowed = this.currentUser.followStateFor(this.model.id);
		var followState = ((isFollowed) ? "followed" : "unfollowed");
		
		
		var content = this.template({ 
			current_user_id: this.currentUser.id,
			initialFollowState: followState
		});
		
    this.$el.html(content);
    this.attachSubviews();
		
		// set up like and follow buttons
		$("button.like-btn").likeToggle();
		$("button.follow-btn").followToggle();
		
    return this;
	}
	
	
});