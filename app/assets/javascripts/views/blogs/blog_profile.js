Tumblero.Views.BlogProfile = Tumblero.ToggableView.extend({
	
	template: JST['blogs/profile'],
	
	events: {
		'click button.follow-btn': "followBlog"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.model, 'sync', this.render);	
	},
	
	
	render: function(){
		this.setFollowState();
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
		this.$el.html(content);
		this.renderFollowButton(this.$('.follow-btn'));
	
		return this;
	},
	
})





