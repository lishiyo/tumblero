	$.LikeToggle = function (el, options) {
		this.$el = $(el);
		this.likeableId = this.$el.data("likeable-id") || options.likeableId;
		this.likeableType = this.$el.data("likeable-type") || options.likeableType;
		this.likeState = this.$el.data("initial-like-state") || options.likeState;

		this.render();
		
		this.$el.on("click", this.handleClick.bind(this));
	};

	$.LikeToggle.prototype.handleClick = function (event) {
		event.preventDefault();
		console.log("clicked like!");
		
		var likeToggle = this;
		var dataParams = {
		 	'likeable_id': this.likeableId,
			'likeable_type': this.likeableType
		};
		
		console.log("dataParams: ", dataParams);
		
		if (this.likeState === "liked") {
			this.likeState = "liking";
			this.render();

			$.ajax({
				url: "/like",
				dataType: "json",
				method: "DELETE",
				data: dataParams,
				success: function (data) {
					console.log("successful delete", data);
					likeToggle.likeState = "unliked";
					likeToggle.render();
				},
				error: function(data) {
					console.log("error in like delete", data);
				}
			});
		} else if (this.likeState === "unliked") {
			this.likeState = "unliking"
			this.render();

			$.ajax({
				url: "/like",
				dataType: "json",
				method: "POST",
				data: dataParams,
				success: function (data) {
					console.log("successful like", data);
					likeToggle.likeState = "liked";
					likeToggle.render();
				},
				error: function(data) {
					console.log("error in like creation", data);
				}
			});
		}
	};

	$.LikeToggle.prototype.render = function () {
		if (this.likeState === "liked") {
			this.$el.prop("disabled", false).addClass("liked");
			this.$el.html("unlike");
		} else if (this.likeState === "unliked") {
			this.$el.prop("disabled", false).removeClass("liked");
			this.$el.html("like");
		} else if (this.likeState === "liking") {
			this.$el.prop("disabled", true);
			this.$el.html("liking...");
		} else if (this.likeState === "unliking") {
			this.$el.prop("disabled", true);
			this.$el.html("unliking...");
		}
	};

	$.fn.likeToggle = function (options) {
		return this.each(function () {
			new $.LikeToggle(this, options);
		});
	};
		
	$(function(){
		
// 		$("button.like-btn").likeToggle();
		
	});