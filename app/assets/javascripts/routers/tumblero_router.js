Tumblero.Routers.Router = Backbone.Router.extend({
	
	initialize: function(opts){
		this.$rootEl = opts.$rootEl;
		this.$headerEl = opts.$headerEl;
		this.currentUser = (opts.currentUser || Tumblero.current_user);
		
		Tumblero.Collections.blogs = new Tumblero.Collections.Blogs({ user: this.currentUser });
		Tumblero.perPage = 6; // EXAMPLE
		
		this.refreshHeader();
	},
	
	user: function(){
		this.currentUser = this.currentUser || Tumblero.current_user;
		return this.currentUser;
	},
	
	refreshHeader: function(){
		Tumblero.Header = new Tumblero.Views.Header({
			currentUser: this.currentUser
		});
		
		this._swapHeader(Tumblero.Header);
	},
	
	routes: {
		"": "checkUser",
		"users/new": "userNew",
		"users/profile": "userShow",
		"session/new": "sessionNew",
		"dashboard/liked": "dashboardLiked",
		"dashboard": "dashboardShow",
		"blogs/new": "blogNew",
		"blogs/:id": "blogShow",	
		"explore/blogs": "blogsExplore",
		"explore": "exploreTrending",
		"explore/:tags": "exploreTags",
		"posts/:id": "postShowFull"
	},
	
	checkRedirect: function(){
		if (!this.user()) {
			Backbone.history.navigate("sessions/new", { trigger: true });
			return true;
		} else {
			return false;
		}
	},
	
	checkUser: function() { 
		if (this.user()){
			this.userShow();
		} else {
			this.sessionNew();
		}
	},
	
	postShowFull: function(id){
		if (this.checkRedirect()) return;
		
		var post = new Tumblero.Models.Post({ id: id });
		post.fetch();
		
		var view = new Tumblero.Views.PostShow({
			currentUser: this.currentUser,
			model: post
		});
		
		this._swapView(view);
		
		$('.post-show').removeClass().toggleClass("post-show-full");
		$('body').removeClass().toggleClass('bg-red-orange');
	},
	
	// sorted by popularity
	exploreTrending: function(){
		if (this.checkRedirect()) return;
		
		var view = new Tumblero.Views.ExploreTags({ 
			queryStr: "",
			currentUser: this.user()
		});
		
		this._swapView(view);
	},
	
	exploreTags: function(query) {
		if (this.checkRedirect()) return;
		
		var queryStr = query.split("+").join(" "); // EX: "Star+Wars"
		
		var view = new Tumblero.Views.ExploreTags({
			queryStr: queryStr,
			currentUser: this.user()
		});
		
		this._swapView(view);
		$('body').removeClass().toggleClass('bg-green');
	},
	
	userNew: function(){
		var newUser = new Tumblero.Models.User();
    var userNewView = new Tumblero.Views.UserNew({ 
			model: newUser });
				
    this._swapView(userNewView);
		
		$('body').addClass('default-background');
	},
	
	sessionNew: function(){
    var newSession = new Tumblero.Models.Session();
    var sessionNewView = new Tumblero.Views.SessionNew({ 
			model: newSession });

    this._swapView(sessionNewView);
		$('body').addClass('default-background');
  },

  userShow: function(id){
		if (this.checkRedirect()) return;
		
		var userShowView = new Tumblero.Views.UserShow({ 
			model: this.user()
		});
		
    this._swapView(userShowView);  
  },
	
	dashboardShow: function(){		
		if (this.checkRedirect()) return;
		
		var user = this.user();	
		var dashboard = new Tumblero.Models.Dashboard({ 
			user: user });	
				
		dashboard.fetch({
			success: function(){
				var view = new Tumblero.Views.DashboardShow({ 
					model: dashboard,
					currentUser: user
				});

				this._swapView(view);
			}.bind(this)
		});
	},
	
	blogShow: function(blog_id){
		if (this.checkRedirect()) return;
		
		var blog = Tumblero.Collections.blogs.getOrFetch(blog_id);
		
		var blogShowView = new Tumblero.Views.BlogShow({
			currentUser: this.user(),
			model: blog
		});
		
		this._swapView(blogShowView);
	},
	
	blogNew: function(){
		if (this.checkRedirect()) return;
		
		var blog = new Tumblero.Models.Blog({ user: this.currentUser });
		var view = new Tumblero.Views.BlogNew({
			currentUser: this.user(),
			model: blog
		});
		
		this._swapView(view);
	},
	
	blogsExplore: function() {
		if (this.checkRedirect()) return;
		
		var blogs = Tumblero.Collections.blogs;
		
		blogs.fetch({
			success: function(){			
				var view = new Tumblero.Views.BlogsExplore ({
					currentUser: this.user(),
					collection: blogs
				});

				this._swapView(view);
			}.bind(this)
		});
		
	},

	_swapView: function(newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
		
		$('body').removeClass();
		$('.follow-up').addClass('hidden');
		$('.loading-overlay').addClass('hidden');
  },
	
	_swapHeader: function(newView) {
		this._headerView && this._headerView.remove();
		this._headerView = newView;
		this.$headerEl.html(newView.render().$el);
	}
	
})