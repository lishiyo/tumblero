window.Tumblero = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
	Assets: {},
	Utils: {},
	
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
			return null;
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
					user = Tumblero.current_user;
			
// 			console.log("clicked reblog-btn with postId and user: ", postId, user);
			
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
		
		$("body").on("click", "button.full-post-modal", function(event){
			event.preventDefault();
			var startTab = ($(event.currentTarget).data("tab-num") || 1),
					post = new Tumblero.Models.Post();

			var newPostFull = new Tumblero.Views.NewPostFull({
				model: post,
				current_user: Tumblero.current_user
			});

			$('.modal-container').html(newPostFull.render().$el);
			
			newPostFull.setActive({ tabNum: startTab });
			
		}.bind(this));
		
// 		$("body").on("click", "button.js-modal-open-1", function(event){
// 			event.preventDefault();
// 			var post = new Tumblero.Models.Post(),
// 					user = Tumblero.current_user;
			
// 			var newPostT1 = new Tumblero.Views.NewPostT1({
// 				model: post,
// 				current_user: user
// 			});

// 			$('.modal-container').html(newPostT1.render().$el);
// 		}.bind(this));

// 		$("body").on("click", "button.js-modal-open-2", function(event){
			
// 			event.preventDefault();
// 			var post = new Tumblero.Models.Post(),
// 					user = Tumblero.current_user;
			
			
// 			var newPostT2 = new Tumblero.Views.NewPostT2({
// 				model: post,
// 				current_user: user
// 			});

// 			$('.modal-container').html(newPostT2.render().$el);
// 		}.bind(this));

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
	
// 	$('.user-profile-btn').on('click', function(e){
// 		e.preventDefault();
// 		window.location.replace("/#users/profile");
// 	});
	
};

$(document).ready(function(){
	
	filepicker.setKey('AFmd243qR4C3FGkOJfBTnz');
	bindNavHandlers();
	
  Tumblero.initialize();
	
});
