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
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);
		
		this.setEditor();
		var postContent = "<blockquote>" + this.model.escape('content') + "</blockquote><br>";
		this.$('#post-content').html(postContent);
		this.$(".modal").addClass("is-open");
		
		return this;
	}
});