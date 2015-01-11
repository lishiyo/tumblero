Tumblero.Views.ReblogForm = Tumblero.PostModal.extend({
	template: JST['posts/reblog_form'],
	
	events: {
		"submit form": "submitReblog"
	},
	
	initialize: function(opts){
		$(".modal").removeClass("is-open");
		this.blogs = opts.current_user.blogs();
	},
	
	submitReblog: function(event){
		event.preventDefault();
		var blogId = $('select#post_blog_id').val();
		
		dataParams = { post: { reblog_blog_id: blogId } };
		dataParams['post']['reblog_blog_id'] = blogId;
		
		console.log("dataParmas", dataParams);
		// create reblog assocation for old post
		$.ajax({
			url: 'posts/'+this.model.id+"/reblog",
			type: 'POST',
			dataType: 'json',
			data: dataParams,
			success: function(data){
				console.log("success", data);
			}
		});
		
		this.submitForm(event);
	},
	
	render: function(){
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);
		
		this.setEditor();
		if (this.model.escape('content')) {
			var postContent = "<blockquote><i class='fa fa-quote-left'></i>" + this.model.escape('content') + "<i class='fa fa-quote-right'></i></blockquote><br>";
			this.$('#post-content').html(postContent);
		}
	
		this.$(".modal").addClass("is-open");
		
		return this;
	}
});