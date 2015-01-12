Tumblero.Views.Header = Backbone.View.extend({
	
	template: JST["layout/header_default"],
	
	events: {
		"click button.full-post-modal": "openPostModal"
	},
	
	initialize: function(opts){
		console.log("header init");
		this.currentUser = (opts.currentUser || Tumblero.current_user);
	},
	
	render: function(){
		var content = this.template();
		this.$el.html(content);
		return this;
	},
	
	refresh: function(){
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
		
	}


// 		$("body").on("click", ".js-modal-close", function(event){
// 			event.preventDefault();
// 			$(".modal").removeClass("is-open");
// 		});

	
})