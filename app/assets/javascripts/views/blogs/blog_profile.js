Tumblero.Views.BlogProfile = Tumblero.ToggableView.extend({
	
	template: JST['blogs/profile'],
	
	events: {
		'click button.follow-btn': "followPoster"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.currentUser, 'sync', this.renderFollow);
		this.listenTo(this.model, 'sync', this.render);	
		
		this.followBtnId = "button#follow-btn-" + this.model.id;
	},
	
	followPoster: function(event){
		event.preventDefault();
		Tumblero.FollowChan.commands.execute("followBlog", { 
			view: this,
			btnId: this.followBtnId
		});
	},
	
	renderFollow: function(){
		this.setFollowState();
	},
	
	render: function(){
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
		this.$el.html(content);
		this.setFollowState();
		this.renderFollowButton(this.followBtnId);
	
		return this;
	},
	
})





