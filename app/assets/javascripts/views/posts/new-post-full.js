Tumblero.Views.NewPostFull = Tumblero.PostModal.extend({
	template: JST['posts/new-post-full'],
	
	events: {
		"click a#tab1": "callTab1",
		"click a#tab2": "callTab2",
		"submit form": "submitForm"
	},
	
	callTab1: function(){
		this.setActive({ tabNum: 1 });
	},
	
	callTab2: function(){
		this.setActive({ tabNum: 2 });
	},
	
	initialize: function(opts){
		this.current_user = opts.current_user;
		this.$tabEl = $('.tab-container');
		$(".modal").removeClass("is-open");
	},
	
	render: function(){	
		var content = this.template();
		this.$el.html(content);		
		
		return this;
	}
});
		