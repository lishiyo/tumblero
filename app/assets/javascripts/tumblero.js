window.Tumblero = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
	Assets: {},
	Utils: {},
	
  initialize: function() {
		
    var $main = $("#main"),
				$nav = $('#main-nav');
		
		new Tumblero.Routers.Router({
			$rootEl: $main,
			currentUser: this.currentUser(),
			$headerEl: $nav
		});
		
		Backbone.history.start();
  },
	
	currentUser: function(){
		if (!Tumblero.current_user) {
			return null;
		} else {
			Tumblero.current_user.fetch({
				success: function(model){
					this.setPostModal(model);
				}.bind(this)
			});
			
			return Tumblero.current_user;
		}
	},

	setPostModal: function(cu){
		
		$("body").on("click", "button.full-post-modal", function(event){
			event.preventDefault();
			var startTab = ($(event.currentTarget).data("tab-num") || 1),
					post = new Tumblero.Models.Post();

			var newPostFull = new Tumblero.Views.NewPostFull({
				model: post,
				currentUser: cu
			});

			$('.modal-container').html(newPostFull.render().$el);
			
			newPostFull.setActive({ tabNum: startTab });
			
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
