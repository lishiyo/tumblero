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
				}.bind(this)
			});
			
			return Tumblero.current_user;
		}
	},
	
	// janky way of navigation
	bindNavHandlers: function(){
		$('.logout-btn').on('click', function(e){
			Tumblero.current_user = null;
		});

	},

};

var siteLoading = function() {
	var $loading = $('.loading-overlay');
	$(window).load(function() {
			$loading.removeClass('active');
	});
};

$(document).ready(function(){
	
	filepicker.setKey('AFmd243qR4C3FGkOJfBTnz');
	
  Tumblero.initialize();
	Tumblero.bindNavHandlers();
	siteLoading();
	
});
