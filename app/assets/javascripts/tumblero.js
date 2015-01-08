window.Tumblero = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
	
  initialize: function() {
		console.log("welcome to backbone");
		
    var $main = $("#main");
		new Tumblero.Routers.Router({
			$rootEl: $main,
			currentUser: this.currentUser()
		});
		Backbone.history.start();
		
  },
	
	currentUser: function(){
		if (!Tumblero.current_user) {
			return new Tumblero.Models.User();
		} else {
			Tumblero.current_user.fetch({
				success: function(){
					this.setPostModal();
					this.setReblogModal();
				}.bind(this)
			});
			
			return Tumblero.current_user;
		}
	},
	
	setReblogModal: function(){
		
		$("body").on("click", ".reblog-btn", function(event){
			event.preventDefault();
			
			var postId = $(event.currentTarget).data("post-id"),
					post = new Tumblero.Models.Post({ id: postId }),
					user = this.currentUser();
			
			console.log("clicked reblog-btn with postId and user: ", postId, user);
			
			post.fetch({
				success: function(model) {
					console.log("setReblogModal got post: ", model);
					
					var reblogView = new Tumblero.Views.ReblogForm({
						model: post,
						current_user: user
					});
					
					$('.modal-container').html(reblogView.render().$el);
				}.bind(this), 
				
				error: function(model, resp) {
					console.log("setReblogModal error", model, resp);
				}
			});
			
		}.bind(this));
	},
	
	setPostModal: function(){
		
		$("body").on("click", ".js-modal-open-1", function(event){
			event.preventDefault();
			var post = new Tumblero.Models.Post(),
					user = this.currentUser();
			
			console.log("currentUser: ", user);
			
			var newPostT1 = new Tumblero.Views.NewPostT1({
				model: post,
				current_user: user
			});

			$('.modal-container').html(newPostT1.render().$el);
		}.bind(this));

		$("body").on("click", ".js-modal-open-2", function(event){
			
			event.preventDefault();
			var post = new Tumblero.Models.Post(),
					user = this.currentUser();
			
			console.log("currentUser: ", user);
			
			var newPostT2 = new Tumblero.Views.NewPostT2({
				model: post,
				current_user: user
			});

			$('.modal-container').html(newPostT2.render().$el);
		}.bind(this));

		$("body").on("click", ".js-modal-close", function(event){
			event.preventDefault();
			$(".modal").removeClass("is-open");
		});

	}
};

// janky way of navigation
var bindNavHandlers = function(){
	$('.logout-btn').on('click', function(e){
		Tumblero.current_user = null;
	});
	
	$('.user-profile-btn').on('click', function(e){
		e.preventDefault();
		console.log("profiel btn clicked");
		window.location.replace("/#users/profile");
	});
	
};

$(document).ready(function(){
	
	bindNavHandlers();
	
  Tumblero.initialize();
	
});
