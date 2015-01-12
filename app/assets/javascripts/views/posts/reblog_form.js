Tumblero.Views.ReblogForm = Tumblero.PostModal.extend({
	template: JST['posts/reblog_form'],
	
	events: {
		"submit form": "submitReblog",
		"click .js-modal-close": "closeModal"
	},
	
	// model = post being reblogged
	initialize: function(opts){
		$(".modal").removeClass("is-open");
		this.blogs = opts.currentUser.blogs();
	},
	
	submitReblog: function(event){
		event.preventDefault();
		var blogId = $('select#post_blog_id').val(),
				view = this;
		
		dataParams = { post: { reblog_blog_id: blogId } };
		
		// create reblog assocation for self only
		$.ajax({
			url: '/api/posts/'+this.model.id+"/reblog",
			type: 'POST',
			dataType: 'json',
			data: dataParams
		}).done(function(data, textStatus){
			// only submit new reblogged post if the reblog was created
			view.submitForm(event);
			view.model.fetch();
// 			view.model.trigger("change", view.model);
			console.log("triggered model", view.model);
		}).fail(function(jqXHR, textStatus, error) {
			console.log("failed", textStatus, error);
		}).always(function(data, textStatus, error){
			console.log("always", data);
		});
		
	},
	
	render: function(){
		var source_id = (this.model.get('source_id') || this.model.id);
		var content = this.template({ 
			post: this.model, 
			blogs: this.blogs,
			source_id: source_id
		});
		this.$el.html(content);
		
		this.setEditor();
		if (this.model.escape('content')) {
			var postContent = "<blockquote>" + this.model.escape('content') + "</blockquote><br>";
			this.$('#post-content').html(postContent);
		}
	
		this.$(".modal").addClass("is-open");
		
		return this;
	}
});