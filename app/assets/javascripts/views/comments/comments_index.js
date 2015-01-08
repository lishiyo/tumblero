Tumblero.Views.CommentsIndex = Backbone.CompositeView.extend({
	
	template: JST['comments/index'],
	
	events: {
		'click .close-comments': 'closeComments',
		'click .reply-comment': 'openReplyForm'
	},
	
	initialize: function(opts){
		// this.collection is all_comments
		this.listenTo(this.collection, 'sync add', this.render);
		this.post = this.collection.post;
	
		
		collection = this.collection;
		this.collection.forEach(function(comm){
			
			if (comm.get('parent_comment_id') === null ) {
				console.log("attaching commsubview in idx", comm);
				this.addCommSubview(comm);
			}
    }.bind(this));
	},
	
	
	addCommSubview: function(comment) {
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment
    });

		var contId = "#comments-index-"+this.post.id;
	
    this.addSubview(contId, commentSubview);
	},
	
	render: function(){
		
		var root_comments = this.collection.filter(function(comment){
			return comment.child_comments().length === 0;
		});
		
		var content = this.template({ 
			post_id: this.post.id
		});
		
		var $close = $('<a class="close-comments" href="">close</a>');
		this.$el.html(content).append($close);
		// attach child comments subviews
		this.attachSubviews();
		
		return this;
	},
	
	closeComments: function(event) {
		event.preventDefault();
		var $commentCont = $(event.currentTarget).closest('.comments-container');
		$commentCont.empty();
		
// 		Backbone.history.navigate("", { replace: true });
	},
	
	openReplyForm: function(event) {
		event.preventDefault();
		var $a = $(event.currentTarget);
		var newComment = new Tumblero.Models.Comment({
			post: this.post
		})
		
		if ($a.data("parent_id")) {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				parent_id: $a.data("parent_id"),
				collection: this.collection
			});
		} else {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				collection: this.collection
			});
		}
		
		$a.replaceWith(newCommView.render().$el);
		
	}
	
	
})