Tumblero.Views.UserNotifications = Backbone.View.extend({
	template: JST['users/notifications'],
	
	events: {
	},
		
	initialize: function(opts){
		this.notifications = this.model.notifications();
		this.notes = this.model.notes();
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.notifications, 'sync remove add', this.render);
		this.listenTo(this.notes, 'sync remove add', this.render);
		
	},
	
	alertNotification: function(content){
		var note = $('<span></span>').html(content).addClass('hidden');
		$('.inline-notifications').removeClass('hidden').prepend(note);
		note.removeClass('hidden').fadeToggle( 1000, "linear" );
	},
	
	render: function(){
		var content = this.template({ user: this.model });
		this.$el.html(content);
		return this;
	}

});