Tumblero.Views.CommentNew = Backbone.View.extend({
	
	template: JST['comments/new'],
	
	events: {
		'submit form': 'createComment'
	},
	
	initialize: function(opts){
		// child comments I belong to
		this.collection = (opts.collection || null);
		this.post = opts.post;
		this.currentUser = this.currentUser;
		this.postView = opts.postView;
		this.parent_id = opts.parent_id || null;
	},
	
	render: function(){
		var content = this.template({ 
			comment: this.model,
			post_id: this.post.id
		});
		this.$el.html(content);
		
		return this;
	},
	
	createComment: function(event) {
		event.preventDefault();
		
		var formData = $(event.currentTarget).serializeJSON(),
				url = "/api/comments",
				commentsColl = this.collection,
				view = this;
		
		formData['comment']['parent_comment_id'] = this.parent_id;
		
		var view = this;
		
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'POST',
			data: formData
		}).done(function(data){
			var newComm = new Tumblero.Models.Comment({ id: data.id });
			newComm.fetch();
			commentsColl.add(newComm);	
			var oldCount = Number(view.post.get('comments_count'));
			view.post.set({comments_count: oldCount+1});
// 			view.postView.incrementCommCount();
// 			$(event.currentTarget).remove();
		}).fail(function(jqXHR, textStatus){
			console.log(textStatus);
		})
	}
	
	
})