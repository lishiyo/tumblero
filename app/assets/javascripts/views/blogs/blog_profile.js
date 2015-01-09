Tumblero.Views.BlogProfile = Backbone.View.extend({
	
	template: JST['blogs/profile'],
	
	events: {
		'click button.follow-btn': "followBlog"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.model, 'sync', this.render);	
	},
	
	setFollowState: function(event){
		
		var isFollowed = this.currentUser.followStateFor(this.model.id);
		this.followState = ((isFollowed) ? "followed" : "unfollowed");
	},
	
	renderButton: function(){
		if (this.followState === "followed") {
			this.$('.follow-btn').prop("disabled", false).addClass("followed");
			this.$('.follow-btn').html("unfollow");
		} else if (this.followState === "unfollowed") {
			this.$('.follow-btn').prop("disabled", false).removeClass("followed");
			this.$('.follow-btn').html("+ follow");
		} else if (this.followState === "following") {
			this.$('.follow-btn').prop("disabled", true);
			this.$('.follow-btn').html("following...");
		} else if (this.followState === "unfollowing") {
			this.$('.follow-btn').prop("disabled", true);
			this.$('.follow-btn').html("unfollowing...");
		}
	},
	
	
	followBlog: function(event){
		event.preventDefault();
		var followToggle = this;
		
		if (this.followState === "followed") {
			this.followState = "following";
			this.renderButton();

			$.ajax({
				url: "/api/blogs/" + followToggle.model.id + "/following",
				dataType: "json",
				method: "DELETE",
				success: function (data) {
					console.log("successful delete", data);
					followToggle.followState = "unfollowed";
					followToggle.renderButton();
				},
				error: function(data) {
					console.log("error in delete", data);
				}
			});
		} else if (this.followState === "unfollowed") {
			this.followState = "unfollowing"
			this.render();

			$.ajax({
				url: "/api/blogs/" + followToggle.model.id + "/following",
				dataType: "json",
				method: "POST",
				success: function (data) {
					console.log("successful follow", data);
					followToggle.followState = "followed";
					followToggle.renderButton();
				},
				error: function(data) {
					console.log("error in follow creation", data);
				}
			});
		}
		
	},
	
	render: function(){
		this.setFollowState();
		var content = this.template({ 
			blog: this.model,
			current_user_id: this.currentUser.id,
			initialFollowState: this.followState
		});
		
		this.$el.html(content);
		this.renderButton();
	
		return this;
	},
	
})





