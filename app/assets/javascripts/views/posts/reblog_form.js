Tumblero.Views.ReblogForm = Tumblero.PostModal.extend({
	template: JST['posts/reblog_form'],
	
	events: {
		"submit form": "submitForm"
	},
	
	initialize: function(opts){
		$(".modal").removeClass("is-open");
		this.blogs = opts.current_user.blogs();
	},
	
	render: function(){
		console.log("blogs", this.blogs);
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);
		
		this.onShow();
		this.$(".modal").addClass("is-open");
		
		return this;
	}
});