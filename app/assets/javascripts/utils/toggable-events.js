// To trigger 'follow' events on a single Dashboard or Blog view (where one follow may apply to multiple posts)

// DashboardShow
Tumblero.FollowChan = Backbone.Wreqr.radio.channel('followings');

Tumblero.FollowChan.commands.setHandlers({
	
	// send in the button
	followBlog: function(opts){	
		
		var followToggle = opts.view, //parentView - dashboard, blog_show
				$btn = followToggle.$(opts.btnId),
				user = followToggle.currentUser,
				blog_id = $btn.data("blog-id"),
				followState = $btn.data("initial-follow-state"),
				callback = opts.callback || null;
				
		if (followState === "followed") {
			$btn.data("initial-follow-state", "unfollowing");
			followToggle.renderFollowButton(opts.btnId);
			
			$.ajax({
				url: "/api/blogs/" + blog_id + "/following",
				dataType: "json",
				method: "DELETE",
				success: function (data) {
// 					console.log("successful delete", data);
					$btn.data("initial-follow-state", "unfollowed");
					followToggle.currentUser.fetch();
					followToggle.renderFollowButton(opts.btnId);		
					callback && callback();
				},
				error: function(data) {
					console.log("error in delete", data);
				}
			});
		} else if (followState === "unfollowed") {
			$btn.data("initial-follow-state", "following");
			followToggle.renderFollowButton(opts.btnId);
			
			$.ajax({
				url: "/api/blogs/" + blog_id + "/following",
				dataType: "json",
				method: "POST",
				success: function (data) {
// 					console.log("successful follow", data);
					$btn.data("initial-follow-state", "followed");
					followToggle.currentUser.fetch();
					followToggle.renderFollowButton(opts.btnId);
					callback && callback();
				},
				error: function(data) {
					console.log("error in follow creation", data);
				}
			});
		}
	}	
});
