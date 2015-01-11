Tumblero.Views.NewPostFull = Tumblero.PostModal.extend({
	template: JST['posts/new-post-full'],
	
	events: {
		"click a#tab1": "callTab1",
		"click a#tab2": "callTab2",
		"submit form": "submitForm"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.$tabEl = $('.tab-container');
		this.blog = (opts.blog || null);
		$(".modal").removeClass("is-open");
	},
		
	callTab1: function(){
		this.setActive({ tabNum: 1 });
	},
	
	callTab2: function(){
		this.setActive({ tabNum: 2 });
	},
	
	render: function(){	
		var content = this.template();
		this.$el.html(content);		
		
		return this;
	}
});
		