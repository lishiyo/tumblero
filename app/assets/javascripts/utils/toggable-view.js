Tumblero.ToggableView = Backbone.CompositeView.extend({
	
	setLikeState: function(type, id, btn){	
		var isLiked = this.currentUser.likeStateFor(type, this.model.id);	
		this.likeState = (isLiked) ? "liked" : "unliked";
		this.likeableType = type;
		this.likeableId = id;
		this.likeButtonId = (btn || ('button.like-btn'));
	},
	
	renderLikeButton: function(btnId){
		var $btn = this.$(btnId);
		if (this.likeState === "liked") {
			$btn.prop("disabled", false).addClass("liked");
		} else if (this.likeState === "unliked") {
			$btn.prop("disabled", false).removeClass("liked");
		} else if (this.likeState === "liking") {
			$btn.prop("disabled", true);
		} else if (this.likeState === "unliking") {
			$btn.prop("disabled", true);
		}
	},
	
	
	likeSubject: function(event) {
		event.preventDefault();
		
		var likeToggle = this,
				$btn = this.$(this.likeButtonId);
		
		var dataParams = {
		 	'likeable_id': this.likeableId,
			'likeable_type': this.likeableType
		};
			
		if (this.likeState === "liked") {
			this.likeState = "unliking";
			this.renderLikeButton($btn);
			$.ajax({
				url: "/api/like",
				dataType: "json",
				method: "DELETE",
				data: dataParams,
				success: function (data) {
					likeToggle.currentUser.fetch();
					likeToggle.likeState = "unliked";
					likeToggle.renderLikeButton($btn);
					likeToggle.model.fetch();
					console.log("deleted like!");
				},
				error: function(data) {
					console.log("error in like delete", data);
				}
			});
		} else if (this.likeState === "unliked") {
			this.likeState = "liking"
			this.renderLikeButton($btn);

			$.ajax({
				url: "/api/like",
				dataType: "json",
				method: "POST",
				data: dataParams,
				success: function (data) {
					likeToggle.currentUser.fetch();
					likeToggle.likeState = "liked";
					likeToggle.renderLikeButton($btn);
					likeToggle.model.fetch();
					console.log("created like!");
				},
				error: function(data) {
					console.log("error in like creation", data);
				}
			});
		}
	},
	
	// FOLLOWINGS (blog_show and blog_profile)
	
	// you can ONLY follow a blog (this.model)
	// btnId refers to actual #id when on blog index page, but class on dashboard/posts
// 	setFollowState: function(btnId){
// 		var isFollowed = this.currentUser.followStateFor(this.model.id);
// 		this.btnId = (btnId || ('button.follow-btn'));
		
// 		this.followState = ((isFollowed) ? "followed" : "unfollowed");
// 	},
	
	setFollowState: function(btnId, model_id) {
		var id = (model_id || this.model.id);
		var isFollowed = this.currentUser.followStateFor(id);
		var btnId = (btnId || ('button.follow-btn'));
		
		if (isFollowed) {
			this.$(btnId).data("initial-follow-state", "followed");
		} else {
			this.$(btnId).data("initial-follow-state", "unfollowed");
		}
	},
	
	renderFollowButton: function(btnId){
		var $btn = this.$(btnId);
		this.followState = $btn.first().data("initial-follow-state");
		
		if (this.followState === "followed") {
			$btn.prop("disabled", false).addClass("followed");
			$btn.html("<i class='fa fa-minus'></i>  unfollow");
		} else if (this.followState === "unfollowed") {
			$btn.prop("disabled", false).removeClass("followed");
			$btn.html("<i class='fa fa-plus'></i>  follow");
		} else if (this.followState === "following") {
			$btn.prop("disabled", true);
			$btn.html("following...");
		} else if (this.followState === "unfollowing") {
			$btn.prop("disabled", true);
			$btn.html("unfollowing...");
		}
		
	},
	
	followBlog: function(event, model_id){
		event.preventDefault();
		var followToggle = this,
				$btn = this.$(this.btnId),
				user = this.currentUser,
				blog_id = (model_id || followToggle.model.id);
		
		if (this.followState === "followed") {
			this.followState = "unfollowing";
			this.renderFollowButton(this.btnId);
			
			$.ajax({
				url: "/api/blogs/" + blog_id + "/following",
				dataType: "json",
				method: "DELETE",
				success: function (data) {
					console.log("successful delete", data);
					followToggle.followState = "unfollowed";
					followToggle.currentUser.fetch();
					followToggle.renderFollowButton(this.btnId);		
// 					followToggle.model.fetch();
				}.bind(this),
				error: function(data) {
					console.log("error in delete", data);
				}
			});
		} else if (this.followState === "unfollowed") {
			this.followState = "following"
			this.renderFollowButton(this.btnId);
			
			$.ajax({
				url: "/api/blogs/" + blog_id + "/following",
				dataType: "json",
				method: "POST",
				success: function (data) {
					console.log("successful follow", data);
					followToggle.followState = "followed";
					followToggle.currentUser.fetch();
					followToggle.renderFollowButton(this.btnId);
// 					followToggle.model.fetch();
				}.bind(this),
				error: function(data) {
					console.log("error in follow creation", data);
				}
			});
		}
	}	
	
})