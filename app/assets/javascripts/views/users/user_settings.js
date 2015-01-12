Tumblero.Views.UserSettings = Backbone.View.extend({
	template: JST['users/settings'],
	
	events: {
		'submit form#edit-user': "updateUser"
	},
		
	initialize: function(opts){
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.blogs(), 'sync remove add', this.render);
	},
	
	updateUser: function(e){
		e.preventDefault();
		var formData = $(e.currentTarget).serializeJSON().user;
		
		this.model.save(formData, {
			success: function(){
				this.alertNotification("successful update");
				console.log("user updated success");
			}.bind(this), 
			error: function(data){
				this.alertNotification("something went wrong");
				console.log("something went wrong", data);
			}.bind(this)
		});
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