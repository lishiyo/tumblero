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
		
		console.log("commentsIndex collection", this.collection);
		
		collection = this.collection;
		this.collection.forEach(function(comm){
			
			console.log("child_comments for", comm, comm.child_comments());
			if (comm.child_comments().length > 0) {
				console.log("attaching commsubview for room_comm:", comm);
				this.addCommSubview(comm);
			}
    }.bind(this));
	},
	
	
	addCommSubview: function(comment) {
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment
    });

    this.addSubview("ul.child-comments-cont", commentSubview);
	},
	
	render: function(){
		var roots = this.collection.filter({
			
		})
		var content = this.template({ root_comments: this.collection });
		// attach child comments subviews
		this.attachSubviews();
		
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