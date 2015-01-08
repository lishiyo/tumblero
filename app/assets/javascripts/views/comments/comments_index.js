FilepickerTest.Views.CommentsIndex = Backbone.View.extend({
	
	template: JST['comments/index'],
	
	events: {
		'click .close-comments': 'closeComments',
		'click .reply-comment': 'openReplyForm'
	},
	
	initialize: function(opts){
		// this.collection is root comments
		this.listenTo(this.collection, 'sync add', this.render);
		this.post = this.collection.post;
		
		this.collection.each
	},
	
	render: function(){
		var content = this.template({ comments: this.collection });
		
		
		var $close = $('<a class="close-comments" href="">close</a>');
		this.$el.html(content).append($close);
		
		return this;
	},
	
	closeComments: function(event) {
		event.preventDefault();
		var $commentCont = $(event.currentTarget).closest('.comments-container');
		$commentCont.empty();
		
		Backbone.history.navigate("", { replace: true });
	},
	
	openReplyForm: function(event) {
		event.preventDefault();
		var $a = $(event.currentTarget);
		var newComment = new FilepickerTest.Models.Comment({
			post: this.post
		})
		
		if ($a.data("parent_id")) {
			var newCommView = new FilepickerTest.Views.CommentNew({
				model: newComment,
				parent_id: $a.data("parent_id"),
				collection: this.collection
			});
		} else {
			var newCommView = new FilepickerTest.Views.CommentNew({
				model: newComment,
				collection: this.collection
			});
		}
		
		$a.replaceWith(newCommView.render().$el);
		
	}
	
	
})