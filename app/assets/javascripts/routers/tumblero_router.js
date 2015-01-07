Tumblero.Routers.Router = Backbone.Router.extend({
	
	initialize: function(opts){
		this.$rootEl = opts.$rootEl
	},
	
	routes: {
		"#": "checkUser",
		"users/new": "userNew",
		"users/profile": "userShow",
		"session/new": "sessionNew"
	},
	
	checkUser: function() { 
		// check if current_user is present and redirect
		if (Tumblero.current_user){
			this.userShow();
		} else {
			this.sessionNew();
		}
	},
	
	userNew: function(){
		console.log("userNew");
		
		var newUser = new Tumblero.Models.User();
    var userNewView = new Tumblero.Views.UserNew({ model: newUser });

    this._swapView(userNewView);
	},
	
	sessionNew: function(){
    var newSession = new Tumblero.Models.Session();
    var sessionNewView = new Tumblero.Views.SessionNew({ model: newSession });

    this._swapView(sessionNewView);
  },

  userShow: function(id){
//     var user = new Tumblero.Models.User({id: id});
		var user = Tumblero.current_user;
    user.fetch();
		console.log(user);
		var userShowView = new Tumblero.Views.UserShow({ model: user });
    this._swapView(userShowView);  
  },
	
	_swapView: function(newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
	
})