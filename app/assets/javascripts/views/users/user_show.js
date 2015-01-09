Tumblero.Views.UserShow = Backbone.CompositeView.extend({
	template: JST['users/show'],
		
	initialize: function(opts){
		this.listenTo(this.model, 'sync', this.render);
		
		this.addSettingsSubview();
	},
	
	addSettingsSubview: function(){
		var settingsView = new Tumblero.Views.UserSettings({
			model: this.model
		});
		
		this.addSubview('#user-settings', settingsView);
	},
	
	render: function(){
		var content = this.template({ user: this.model });
		this.$el.html(content);
		this.attachSubviews();
		
		return this;
	}

});