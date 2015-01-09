Tumblero.Views.NewPostFull = Tumblero.PostModal.extend({
	template: JST['posts/new-post-full'],
	
	events: {
		"click #tab1": "showTab1",
		"click #tab2": "showTab2"
	},
	
	initialize: function(opts){
		this.current_user = opts.current_user;
		this.$tabEl = $('.tab-container');
		console.log("newpostfull", this.current_user)
	},
	
	render: function(){	
		var content = this.template();
		this.$el.html(content);		

		this.setActive({ tabNum: 1 });
		
		return this;
	}
});
		