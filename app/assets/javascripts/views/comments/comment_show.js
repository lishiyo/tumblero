Tumblero.Views.CommentShow = Tumblero.ToggableView.extend({
	
	template: JST['comments/_comment'],
	
	events: {
		'click .reply-comment': 'openReplyForm',
		'click button.like-comment': "likeSubject"
	},
	
// 	tagName: "li",
	
// 	className: "child-comment",
	
// 	id: function(){
// 		var contEl = "#comment-show-"+this.model.id;
// 		return contEl;
// 	},
	
	// this.model = comment with child_comments
	initialize: function(opts){
		this.post = opts.post;
		this.currentUser = opts.currentUser;
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.child_comments(), 'sync', this.render);
		this.listenTo(this.model.child_comments(), 'remove', this.removeComment);
		this.listenTo(this.model.child_comments(), 'add', this.addComment);
		
		// add subviews for child_comments
		if (this.model.child_comments().length > 0) {
			this.model.child_comments().each(function(comment){
				this.addCommSubview(comment);
			}.bind(this));
		}
		
		this.likeButtonId = "button#like-btn-" + this.model.id;
	},
	
	removeComment: function(){
		this.render();
	},
	
	addComment: function(comment){
		this.addCommSubview(comment);
		this.render();
	},
	
	addCommSubview: function(comment) {
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment,
			post: this.post,
			currentUser: this.currentUser
    });
    this.addSubview("#more-child-comment-"+this.model.id, commentSubview);
	},
	
	openReplyForm: function(event) {
		event.preventDefault();
		var $a = $(event.currentTarget);
		
		var newComment = new Tumblero.Models.Comment({
			post: this.post
		});
		
		if ($a.data("parent_id")) {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				parent_id: $a.data("parent_id"),
				collection: this.model.child_comments(),
				post_id: this.post.id
			});
		} else {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				collection: this.model.child_comments(),
				post_id: this.post.id
			});
		}
		
		$a.replaceWith(newCommView.render().$el);
		
	},
	
	render: function(){		
		this.setLikeState('Comment', this.model.id, this.likeButtonId);
		console.log("showing likestate", this.likeState);
		var content = this.template({ 
			comment: this.model,
			initialLikeState: this.likeState
		});
		
    this.$el.html(content);
    this.attachSubviews();
		
		this.renderLikeButton(this.likeButtonId);
    return this;
	}
});