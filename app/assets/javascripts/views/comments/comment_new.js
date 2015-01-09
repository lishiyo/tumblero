Tumblero.Views.CommentNew = Backbone.View.extend({
	
	template: JST['comments/new'],
	
	events: {
		'submit form': 'createComment'
	},
	
	initialize: function(opts){
		this.parent_id = opts.parent_id || null;
		this.collection = opts.collection;
		this.post_id = opts.post_id;
		this.currentUser = this.currentUser;
	},
	
	render: function(){
		console.log("post_id", this.post_id);
		
		var content = this.template({ 
			comment: this.model,
			post_id: this.post_id
		});
		this.$el.html(content);
		
		return this;
	},
	
	createComment: function(event) {
		event.preventDefault();
		
		var formData = $(event.currentTarget).serializeJSON();
// 		var url = '/posts/'+this.model.post.id+'/new_comment';
		var url = "/comments"
		formData['comment']['parent_comment_id'] = this.parent_id;
		
		console.log("createComment", formData);
		
		var commentsColl = this.collection;
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'POST',
			data: formData
		}).done(function(data){
			console.log("created comment", data);
			var newPost = new Tumblero.Models.Comment({ id: data.id });
			newPost.fetch();
			commentsColl.add(newPost);
// 			console.log("added coll", commentsColl);
			
			$(event.currentTarget).remove();
		}).fail(function(jqXHR, textStatus){
			console.log(textStatus);
		})
	}
	
	
})