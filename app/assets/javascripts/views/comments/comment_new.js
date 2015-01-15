Tumblero.Views.CommentNew = Backbone.View.extend({
	
	template: JST['comments/new'],
	
	events: {
		'submit form': 'createComment'
	},
	
	initialize: function(opts){
		this.collection = opts.collection;
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
	
// 	incrementCount: function(){
// 		var commCount = this.$el.closest('.post').first().find('.count-comments');
// 		var currCount = commCount.data("curr-count");
// 		var newCount = currCount + 1;
// 		commCount.data("curr-count", newCount);
// 		console.log("incCount", this.$el, this.$el.closest('.post'), commCount, currCount, newCount)
// 		commCount.text(newCount);
// 	},
	
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
			$(event.currentTarget).remove();
		}).fail(function(jqXHR, textStatus){
			console.log(textStatus);
		})
	}
	
	
})