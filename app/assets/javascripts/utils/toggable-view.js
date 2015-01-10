Tumblero.ToggableView = Backbone.CompositeView.extend({
	
	setLikeState: function(type, id){	
		var isLiked = this.currentUser.likeStateFor('Post', this.model.id);	
		this.likeState = (isLiked) ? "liked" : "unliked";	
		this.likeableId = id;
		this.likeableType = type;
// 		this.$likeBtn = this.$('.like-btn');
	},
	
	renderLikeButton: function($btn){
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
	
	setFollowState: function(){
		var isFollowed = this.currentUser.followStateFor(this.model.id);
		this.followState = ((isFollowed) ? "followed" : "unfollowed");
// 		this.$followBtn = this.$('.follow-btn');
	},
	
	renderFollowButton: function($btn){
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
			$btn.$('.follow-btn').prop("disabled", true);
			$btn.html("unfollowing...");
		}
		
	},
	
	
	followBlog: function(event){
		event.preventDefault();
		var followToggle = this,
				$btn = $('button.follow-btn');
		
		if (this.followState === "followed") {
			this.followState = "following";
			this.renderFollowButton($btn);

			$.ajax({
				url: "/api/blogs/" + followToggle.model.id + "/following",
				dataType: "json",
				method: "DELETE",
				success: function (data) {
					console.log("successful delete", data);
					followToggle.followState = "unfollowed";
					followToggle.renderFollowButton($btn);
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
					followToggle.renderFollowButton($btn);
				},
				error: function(data) {
					console.log("error in follow creation", data);
				}
			});
		}
		
	},
	
	likeSubject: function(event) {
		event.preventDefault();
		console.log("clicked like!");
		
		var likeToggle = this,
				$btn = this.$('button.like-btn');
		
		var dataParams = {
		 	'likeable_id': this.likeableId,
			'likeable_type': this.likeableType
		};
		
		console.log("dataParams: ", dataParams);
		
		if (this.likeState === "liked") {
			this.likeState = "liking";
			this.renderLikeButton($btn);

			$.ajax({
				url: "/like",
				dataType: "json",
				method: "DELETE",
				data: dataParams,
				success: function (data) {
					console.log("successful delete", data);
					likeToggle.likeState = "unliked";
					likeToggle.renderLikeButton($btn);
				},
				error: function(data) {
					console.log("error in like delete", data);
				}
			});
		} else if (this.likeState === "unliked") {
			this.likeState = "unliking"
			this.renderLikeButton($btn);

			$.ajax({
				url: "/like",
				dataType: "json",
				method: "POST",
				data: dataParams,
				success: function (data) {
					console.log("successful like", data);
					likeToggle.likeState = "liked";
					likeToggle.renderLikeButton($btn);
				},
				error: function(data) {
					console.log("error in like creation", data);
				}
			});
		}
	}
	
	
})