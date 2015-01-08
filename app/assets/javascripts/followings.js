	
	$.FollowToggle = function (el, options) {
		this.$el = $(el);
		this.blogId = this.$el.data("blog-id") || options.blogId;
		this.followState = this.$el.data("initial-follow-state") || options.followState;

		this.render();

		this.$el.on("click", this.handleClick.bind(this));
	};

	$.FollowToggle.prototype.handleClick = function (event) {
		var followToggle = this;

		event.preventDefault();

		if (this.followState === "followed") {
			this.followState = "following";
			this.render();

			$.ajax({
				url: "/blogs/" + this.blogId + "/following",
				dataType: "json",
				method: "DELETE",
				success: function (data) {
					console.log("successful delete", data);
					followToggle.followState = "unfollowed";
					followToggle.render();
				},
				error: function(data) {
					console.log("error in delete", data);
				}
			});
		} else if (this.followState === "unfollowed") {
			this.followState = "unfollowing"
			this.render();

			$.ajax({
				url: "/blogs/" + this.blogId + "/following",
				dataType: "json",
				method: "POST",
				success: function (data) {
					console.log("successful follow", data);
					followToggle.followState = "followed";
					followToggle.render();
				},
				error: function(data) {
					console.log("error in follow creation", data);
				}
			});
		}
	};

	$.FollowToggle.prototype.render = function () {
		if (this.followState === "followed") {
			this.$el.prop("disabled", false).addClass("followed");
			this.$el.html("unfollow");
		} else if (this.followState === "unfollowed") {
			this.$el.prop("disabled", false).removeClass("followed");
			this.$el.html("+ follow");
		} else if (this.followState === "following") {
			this.$el.prop("disabled", true);
			this.$el.html("following...");
		} else if (this.followState === "unfollowing") {
			this.$el.prop("disabled", true);
			this.$el.html("unfollowing...");
		}
	};

	$.fn.followToggle = function (options) {
		return this.each(function () {
			new $.FollowToggle(this, options);
		});
	};
		
	$(function(){
		
		$("button.follow-btn").followToggle();
		
	});