Tumblero.Views.BlogProfile = Tumblero.ToggableView.extend({
	
	template: JST['blogs/profile'],
	
	events: {
		'click button.follow-btn': "followBlog"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.currentUser, 'sync', this.renderFollow);
		this.listenTo(this.model, 'sync', this.render);	
		
		this.followBtnId = "button#follow-btn-" + this.model.id;
	},
	
	renderFollow: function(){
		this.setFollowState();
	},
	
	render: function(){
		console.log("called render in blog profile");
		
		this.setFollowState();
		
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
		this.$el.html(content);
		this.renderFollowButton(this.followBtnId);
	
		return this;
	},
	
})





