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
		console.log("form", formData);
		
		this.model.save(formData, {
			success: function(){
				console.log("user updated success");
			}, 
			error: function(data){
				console.log("something went wrong", data);
			}
		});
	},
	
	render: function(){
		var content = this.template({ user: this.model });
		this.$el.html(content);
		
		return this;
	}

});