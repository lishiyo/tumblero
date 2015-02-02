// currentUser's liked blogs + followed blogs
Tumblero.Views.AccountSidebar = Tumblero.ToggableView.extend({
	
	template: JST['dashboard/account_sidebar'],
	
	events: {
		'click .liked-posts': 'showLikedPosts',
		'click .followed-blogs': 'showFollowedBlogs'
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.dashboard = opts.dashboard;
		this.posts = this.dashboard.liked_posts();
		this.dashboardView = opts.dashboardView;
		
		this.listenTo(this.currentUser, 'sync', this.render);
	},
	
	showLikedPosts: function(){
		console.log("showLikedPosts");
		Backbone.history.navigate('dashboard/liked', {trigger: true});
// 		this.dashboardView.renderLikedPosts();		
	},
	
	render: function(){
		var content = this.template({ 
			user: this.currentUser
		});
		
		this.$el.html(content);
		return this;
	},
	
});





