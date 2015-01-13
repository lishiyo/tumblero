Tumblero.Views.UserShow = Backbone.CompositeView.extend({
	template: JST['users/show'],
	
	events: {
		'click .blog-settings-btn': "showBlogSettings",
		'click .user-settings-btn': "showUserSettings",
	},
		
	initialize: function(opts){
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.blogs(), 'sync change add remove', this.render);
		this.showUserSettings();
	},
	
	showUserSettings: function(e){
		if (e) { e.preventDefault(); }
		
		if (this._currSubview) {
			this.removeSubview('#settings', this._currSubview);
		}
		
		var settingsView = new Tumblero.Views.UserSettings({
			model: this.model
		});
		
		this.addSubview('#settings', settingsView);
		this._currSubview = settingsView;
		this.render();
	},
	
	showBlogSettings: function(e){
		e.preventDefault();
		if (this._currSubview) {
			this.removeSubview('#settings', this._currSubview);
		}
		
		var blog_id = $(e.currentTarget).data("blog-id");
		var blog = Tumblero.Collections.blogs.getOrFetch(blog_id);
		var view = new Tumblero.Views.BlogSettings({
			currentUser: (this.currentUser || Tumblero.current_user), 
			model: blog
		});
				
		this.addSubview('#settings', view);
		this._currSubview = view;
		this.render();
	},
	
	render: function(){
		
		var content = this.template({ user: this.model });
		this.$el.html(content);
		this.attachSubviews();
		
		return this;
	}

});