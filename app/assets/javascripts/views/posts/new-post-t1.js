Tumblero.Views.NewPostT1 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT1'],
	
	events: {
		"click .upload-fp": 'upload',
	},
	
	initialize: function(opts){
// 		$(".modal").removeClass("is-open");
		this.blogs = opts.current_user.blogs();
	},
	
	
	render: function(){
		
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);
		this.setEditor();
// 		this.setActive({ tabNum: 1 });
		
// 		this.$(".modal").addClass("is-open");
		return this;
	}
});
		