Tumblero.Views.Header = Backbone.View.extend({
	
	template: JST["layout/header_default"],
	
	initialize: function(opts){
		console.log("header init");
		this.currentUser = opts.currentUser;
	},
	
	render: function(){
		var content = this.template();
		this.$el.html(content);
		return this;
	},
	
	signIn: function(){
		
	}
	
})