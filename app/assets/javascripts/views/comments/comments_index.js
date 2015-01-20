Tumblero.Views.CommentsIndex = Backbone.CompositeView.extend({
	
	template: JST['comments/index'],
	
	events: {
		'click .close-comments': 'closeComments',
// 		'click .reply-comment': 'openReplyForm'
	},
	
	initialize: function(opts){
		// this.collection is all_comments
		this.listenTo(this.collection, 'remove change', this.render);
// 		this.listenTo(this.collection, 'add', this.render);
		this.post = opts.post;
		this.currentUser = opts.currentUser;
		this.postView = opts.postView;
	},
	
	// only add subviews of root comments
	addAllRoots: function(){
		this.collection.forEach(function(comm){
			if (comm.get('parent_comment_id') === null ) {
				this.addCommSubview(comm);
			}
    }.bind(this));
	},
	
	addCommSubview: function(comment) {

		view = this;
		
		if (comment.get('main_blog_id') === this.currentUser.get('main_blog_id')) {
			this.shouldShowFollow = false;
		} else {
			this.shouldShowFollow = true;
		}
		
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment,
			post: this.post,
			currentUser: this.currentUser,
			postView: this.postView,
			shouldShowFollow: this.shouldShowFollow
    });

		var contId = "#comments-index-"+this.post.id;
	
    this.addSubview(contId, commentSubview);
	},
	
	addReplyForm: function() {
		
		var newComment = new Tumblero.Models.Comment({
			post: this.post
		});
		
		var newCommView = new Tumblero.Views.CommentNew({
			model: newComment,
			collection: this.collection,
			post: this.post,
			postView: this.postView
		});
		
		var contId = this.$('.reply-form-container');
		
		this.addSubview(contId, newCommView);
// 		contId.html(newCommView.render().$el);
	},
	
	render: function(){
		var content = this.template({ post_id: this.post.id });
		
		var $close = $('<a href="#"><i class="fa fa-angle-double-up"></i> close <i class="fa fa-angle-double-up"></i></a>').addClass('close-comments');
		this.$el.html(content).append($close);
		this.addReplyForm();
		// attach child comments subviews
		this.addAllRoots();
		
		return this;
	},
	
	closeComments: function(event) {
		event.preventDefault();
		var $commentCont = $(event.currentTarget).closest('.comments-container');
		$commentCont.empty();
	},
	
	openReplyForm: function(event) {
		event.preventDefault();
		var $a = $(event.currentTarget);
		var newComment = new Tumblero.Models.Comment({
			post: this.post
		});
		
		if ($a.data("parent_id")) {
			var newCommView = new Tumblero.Views.CommentNew({
				postView: this.postView,
				model: newComment,
				parent_id: $a.data("parent_id"),
				collection: this.collection,
				post: this.post,
				currentUser: this.currentUser,
			});
		} else {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				collection: this.collection,
				post: this.post,
				currentUser: this.currentUser,
				postView: this.postView
			});
		}
		
		$a.replaceWith(newCommView.render().$el);
	}
	
	
})