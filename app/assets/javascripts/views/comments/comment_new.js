Tumblero.Views.CommentNew = Backbone.View.extend({
	
	template: JST['comments/new'],
	
	events: {
		'submit form': 'createComment'
	},
	
	initialize: function(opts){
		this.parent_id = opts.parent_id || null;
		this.collection = opts.collection;
	},
	
	render: function(){
		var content = this.template({ comment: this.model });
		this.$el.html(content);
		
		return this;
	},
	
	createComment: function(event) {
		event.preventDefault();
		var formData = $(event.currentTarget).serializeJSON();
		var url = '/posts/'+this.model.post.id+'/new_comment';
		
		formData['comment']['parent_id'] = this.parent_id;
		
		
		var commentsColl = this.collection;
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'POST',
			data: formData
		}).done(function(data){
			console.log("success", data);
			var newPost = new FilepickerTest.Models.Comment({ id: data.id });
			
			commentsColl.add(newPost);
			console.log("second coll", commentsColl);
			
			$(event.currentTarget).remove();
		}).fail(function(jqXHR, textStatus){
			console.log(textStatus);
		})
	}
	
	
})