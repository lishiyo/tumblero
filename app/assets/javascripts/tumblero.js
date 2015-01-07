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
  }
};

$(document).ready(function(){
	// listen to logout click event
	$('.logout-btn').on('click', function(e){
		Tumblero.current_user = null;
	});
	
  Tumblero.initialize();
	
});
