Tumblero.Views.Header = Backbone.View.extend({
	
	template: JST["layout/header_basic"],
	
	events: {
		"click button#nav-post": "openPostModal",
		"focus #nav-search": "initAutocomplete",
		'keyup #nav-search': 'checkSearch'
	},
	
	initialize: function(opts){
		this.currentUser = (opts.currentUser || Tumblero.current_user);
		if (this.currentUser) {
			this.listenTo(this.currentUser, 'sync', this.setProfile);
			this.listenTo(this.currentUser, 'sync', this.setNotifications);
		}
	},
	
	setNotifications: function(){
		this.notifications = this.currentUser.notifications();
		this.$cont = $('ul#notifications-dropdown');
		this.$cont.empty();
		
		var template = JST['layout/_notifications'];
		var content = template({ notifications: this.notifications });
		this.$('strong.badge').text(this.notifications.length);
		
		this.$cont.append(content);
	},
	
	setProfile: function(){
		$('ul.header-notifications .user-blog').remove();
		this.currentUser.blogs().each(function(blog) {
			var a = $('<a></a>').attr("href", "#/blogs/"+blog.id).html('<i class="fa fa-bolt"></i> '+ blog.escape('handle'));
			var content = $('<li class="user-blog"></li>').append(a);
			content.appendTo($('ul.header-notifications'));
		});
	},
	
	render: function(){
		var content = this.template({ user: this.currentUser });
		this.$el.html(content);
		return this;
	},
	
	refresh: function(opts){
		this.currentUser = (opts.currentUser || Tumblero.current_user);
		this.listenTo(this.currentUser, 'sync', this.setProfile);
		this.listenTo(this.currentUser, 'sync', this.setNotifications);
		this.render();		
	},
	
	openPostModal: function(event){
		event.preventDefault();		
		var startTab = ($(event.currentTarget).data("tab-num") || 1),
				post = new Tumblero.Models.Post();
		var newPostFull = new Tumblero.Views.NewPostFull({
			model: post,
			currentUser: this.currentUser
		});

		$('.modal-container').html(newPostFull.render().$el);

		newPostFull.setActive({ tabNum: startTab });		
	},
	
	
// 	mainSearch: function(event) {
// 		event.preventDefault();
// 		var query = this.$("#nav-search").val().split(" ").join("+");
		
// 		// pass in query to router, which swaps view to SearchTags
// 		var url = "/explore/" + query;
// 		console.log("query is", url);
// 		Backbone.history.navigate(url, {trigger: true});
// 	},
	
	
});

_.extend(Tumblero.Views.Header.prototype, Tumblero.Utils.Sortable);
_.extend(Tumblero.Views.Header.prototype, Tumblero.Utils.Searchable);