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
	
	render: function(){
		var content = this.template();
		this.$el.html(content);
		return this;
	},
	
	refresh: function(){
		this.render();
	},
	
// 	mainSearch: function(event) {
// 		event.preventDefault();
// 		var query = this.$("#nav-search").val().split(" ").join("+");
		
// 		// pass in query to router, which swaps view to SearchTags
// 		var url = "/explore/" + query;
// 		console.log("query is", url);
// 		Backbone.history.navigate(url, {trigger: true});
// 	},
	
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
		
	}
	
});

_.extend(Tumblero.Views.Header.prototype, Tumblero.Utils.Sortable);
_.extend(Tumblero.Views.Header.prototype, Tumblero.Utils.Searchable);