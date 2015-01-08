window.Tumblero = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    console.log('Hello from Backbone!');
		
		var $main = $("#main");
		new Tumblero.Routers.Router({
			$rootEl: $main
		});
		Backbone.history.start();
  },
	
	setPostModal: function(){
		
		$("body").on("click", ".js-modal-open-1", function(event){
			event.preventDefault();

			var post = new Tumblero.Models.Post();
			var blog_id = $(event.currentTarget).data("id");
			console.log(blog_id);
			var newPostT1 = new Tumblero.Views.NewPostT1({
				model: post,
				blog_id: blog_id
			});

			$('.modal-container').html(newPostT1.render().$el);
		});

		$("body").on("click", ".js-modal-open-2", function(event){
			event.preventDefault();

			// render new Post view
			var post = new Tumblero.Models.Post();
			var blog_id = $(event.currentTarget).data("id");
			console.log(blog_id);
			var newPostT2 = new Tumblero.Views.NewPostT2({
				model: post,
				blog_id: blog_id
			});

			$('.modal-container').html(newPostT2.render().$el);
		});

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
	Tumblero.setPostModal();
	
});
