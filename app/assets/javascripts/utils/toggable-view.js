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
			$btn.html("unlike");
		} else if (this.likeState === "unliked") {
			$btn.prop("disabled", false).removeClass("liked");
			$btn.html("like");
		} else if (this.likeState === "liking") {
			$btn.prop("disabled", true);
			$btn.html("liking...");
		} else if (this.likeState === "unliking") {
			$btn.prop("disabled", true);
			$btn.html("unliking...");
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
				},
				error: function(data) {
					console.log("error in like creation", data);
				}
			});
		}
	},
	
	// you can only follow a blog
	setFollowState: function(btnId){
		var isFollowed = this.currentUser.followStateFor(this.model.id);
		this.followState = ((isFollowed) ? "followed" : "unfollowed");
		
		this.btnId = (btnId || ('button.follow-btn'));
	},
	
	renderFollowButton: function(btnId){
		var $btn = this.$(btnId);
		if (this.followState === "followed") {
			$btn.prop("disabled", false).addClass("followed");
			$btn.html("unfollow");
		} else if (this.followState === "unfollowed") {
			$btn.prop("disabled", false).removeClass("followed");
			$btn.html("+ follow");
		} else if (this.followState === "following") {
			$btn.prop("disabled", true);
			$btn.html("following...");
		} else if (this.followState === "unfollowing") {
			$btn.prop("disabled", true);
			$btn.html("unfollowing...");
		}
		
	},
	
	
	followBlog: function(event){
		event.preventDefault();
		var followToggle = this,
				$btn = this.$(this.btnId),
				user = this.currentUser;
		
		if (this.followState === "followed") {
			this.followState = "unfollowing";
			this.renderFollowButton($btn);

			$.ajax({
				url: "/api/blogs/" + followToggle.model.id + "/following",
				dataType: "json",
				method: "DELETE",
				success: function (data) {
					console.log("successful delete", data);
					followToggle.followState = "unfollowed";
					followToggle.currentUser.fetch();
					followToggle.renderFollowButton($btn);		
// 					followToggle.model.fetch();
				},
				error: function(data) {
					console.log("error in delete", data);
				}
			});
		} else if (this.followState === "unfollowed") {
			this.followState = "following"
			this.renderFollowButton($btn);

			$.ajax({
				url: "/api/blogs/" + followToggle.model.id + "/following",
				dataType: "json",
				method: "POST",
				success: function (data) {
					console.log("successful follow", data);
					followToggle.followState = "followed";
					followToggle.currentUser.fetch();
					followToggle.renderFollowButton($btn);
// 					followToggle.model.fetch();
				},
				error: function(data) {
					console.log("error in follow creation", data);
				}
			});
		}
		
	}	
	
})