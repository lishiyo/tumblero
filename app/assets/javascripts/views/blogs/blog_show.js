Tumblero.Views.BlogShow = Tumblero.ToggableView.extend({
	
	template: JST['blogs/show'],
	events: {
		'click .reSort': 'reSortBy'
	},
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.collection = this.model.posts();
		
		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.model, 'sync', this.render);
		
		this.listenTo(this.collection, 'sort', this.render);
		this.listenTo(this.collection, 'add', this.addPost);
		
	},
	
	addPost: function(post){
		this.addPostSubview(post);
// 		this.render();
	},
	
	addAllPosts: function() {		
		// add subviews for posts
		this.model.posts().each(function(post){
			this.addPostSubview(post);
		}.bind(this));
	},
	
	addPostSubview: function(post){
// 		console.log("addPostSubview called", post);
		var subview = new Tumblero.Views.PostShow({
      model: post,
			blog: this.model,
			currentUser: this.currentUser
    });
		
    this.addSubview(".posts-container", subview);
	},
	
	render: function(){
			
		this.setFollowState();		
		
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
		this.addAllPosts();
		
//     this.attachSubviews();
		this.renderFollowButton(this.$('.follow-btn'));
		
    return this;
	}
	
	
});


_.extend(Tumblero.Views.BlogShow.prototype, Tumblero.Utils.Sortable);