Tumblero.Routers.Router = Backbone.Router.extend({
	
	initialize: function(opts){
		this.$rootEl = opts.$rootEl;
		this.currentUser = opts.currentUser;
		
		Tumblero.Collections.blogs = new Tumblero.Collections.Blogs({ user: this.currentUser });
		
	},
	
	routes: {
		"#": "checkUser",
		"users/new": "userNew",
		"users/profile": "userShow",
		"session/new": "sessionNew",
		"blogs/new": "blogNew",
		"blogs/:id": "blogShow",
		"dashboard": "dashboardShow",
		"explore/blogs": "blogsExplore"
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
    var user = this.currentUser;
		
		var userShowView = new Tumblero.Views.UserShow({ model: user });
    this._swapView(userShowView);  
  },
	
	dashboardShow: function(){
		var dashboard = new Tumblero.Models.Dashboard({ user: this.currentUser });
		dashboard.fetch();
		var view = new Tumblero.Views.DashboardShow({ 
			model: dashboard,
			currentUser: this.currentUser
		});
		this._swapView(view);
	},
	
	blogShow: function(blog_id){
// 		var blog = new Tumblero.Models.Blog({id: blog_id});
// 		blog.fetch();
		
		var blog = Tumblero.Collections.blogs.getOrFetch(blog_id);
		
		var blogShowView = new Tumblero.Views.BlogShow({
			currentUser: this.currentUser, 
			model: blog
		});
		
		this._swapView(blogShowView);

	},
	
	blogNew: function(){
		var blog = new Tumblero.Models.Blog({ user: this.currentUser });
		var view = new Tumblero.Views.BlogNew({
			currentUser: this.currentUser,
			model: blog
		});
		
		this._swapView(view);
	},
	
	blogsExplore: function(){
		// create global
		var blogs = Tumblero.Collections.blogs
		
		blogs.fetch({
			success: function(){			
				var view = new Tumblero.Views.BlogsExplore ({
					currentUser: this.currentUser,
					collection: blogs
				});

				this._swapView(view);
				
				
				
			}.bind(this)
		});
		
	},
	
	current : function() {
    var Router = this,
        fragment = Backbone.history.fragment,
        routes = _.pairs(Router.routes),
        route = null, params = null, matched;

    matched = _.find(routes, function(handler) {
        route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
        return route.test(fragment);
    });

    if(matched) {
        // NEW: Extracts the params using the internal
        // function _extractParameters 
        params = Router._extractParameters(route, fragment);
        route = matched[1];
    }

    return {
        route : route,
        fragment : fragment,
        params : params
    };
	},
	
// 	showComments: function(post_id){
		
// 		var commCont = '#post-comments-' + post_id;
// 		var $commCont = $(commCont);
// 		var post = new Tumblero.Models.Post({id: post_id});
		
// 		post.fetch({
// 			success: function(){
// 				var all_comments = new Tumblero.Collections.Comments({ post: post });
// 				all_comments.fetch({
// 					success: function(){
// 						var commentsIndex = new Tumblero.Views.CommentsIndex({ collection: all_comments });

// 					$commCont.html(commentsIndex.render().$el);
// 					}
// 				});
				
// 			},
// 			error: function(){
// 				console.log("something went wrong");
// 			}
// 		})
		
		
// 	},
	
	_swapView: function(newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
	
})