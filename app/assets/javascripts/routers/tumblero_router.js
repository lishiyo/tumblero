Tumblero.Routers.Router = Backbone.Router.extend({
	
	initialize: function(opts){
		this.$rootEl = opts.$rootEl;
		this.currentUser = opts.currentUser;
	},
	
	routes: {
		"#": "checkUser",
		"users/new": "userNew",
		"users/profile": "userShow",
		"session/new": "sessionNew",
		"blogs/new": "blogNew",
		"blogs/:id": "blogShow",
		"posts/:post_id/comments": "showComments",
		
	},
	
	checkUser: function() { 
		// check if current_user is present and redirect
		console.log("checkUser", this.currentUser);
		if (this.currentUser){
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
// 		var user = Tumblero.current_user;
    var user = this.currentUser;
// 		user.fetch();
		console.log("userShow", user);
		
		var userShowView = new Tumblero.Views.UserShow({ model: user });
    this._swapView(userShowView);  
  },
	
	blogNew: function(){
		
	},
	
	blogShow: function(){

	},
	
	showComments: function(post_id){
		
		var commCont = '#post-comments-' + post_id;
		var $commCont = $(commCont);
		var post = new Tumblero.Models.Post({id: post_id});
		
		post.fetch({
			success: function(){
				var all_comments = new Tumblero.Collections.Comments({ post: post });
				all_comments.fetch({
					success: function(){
						var commentsIndex = new Tumblero.Views.CommentsIndex({ collection: all_comments });

					$commCont.html(commentsIndex.render().$el);
					}
				});
				
			},
			error: function(){
				console.log("something went wrong");
			}
		})
		
		
	},
	
	_swapView: function(newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
	
})