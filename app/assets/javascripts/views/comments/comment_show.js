Tumblero.Views.CommentShow = Tumblero.ToggableView.extend({
	
	template: JST['comments/_comment'],
	
	events: {
		'click .reply-comment': 'openReplyForm',
		'click button.like-comment': "likeSubject",
		'click button.follow-btn': "followCommenter"
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
		this.postView = opts.postView;
		this.collection = this.model.child_comments();
		this.blog_id = this.model.get('main_blog_id');
		
		if (this.blog_id === this.currentUser.get('main_blog_id')) {
			this.shouldShowFollow = false;
		} else {
			this.shouldShowFollow = true;
		}
		
		this.listenTo(this.model, 'sync change', this.render);
// 		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, 'remove', this.removeComment);
		this.listenTo(this.collection, 'add', this.addComment);
		
		this.likeButtonId = "button#like-btn-" + this.model.id;
		this.followBtnId = "button#follow-btn-" + this.blog_id;
	},
	
	followCommenter: function(event){
		this.followBlog(event, this.blog_id);	
	},
	
	removeComment: function(){
		// turn body into null like Reddit
		this.render();
	},
	
	addComment: function(comment){
		this.addCommSubview(comment);
// 		this.render();
	},
	
	addAllComments: function(){
		// add subviews for child_comments
		if (this.model.child_comments().length > 0) {
			this.collection.each(function(comment){
				this.addCommSubview(comment);
			}.bind(this));
		}	
	},
	
	addCommSubview: function(comment) {
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment,
			post: this.post,
			currentUser: this.currentUser,
			postView: this.postView
    });
		
    this.addSubview("#more-child-comment-"+this.model.id, commentSubview);
	},
	
	openReplyForm: function(event) {
		event.preventDefault();
		var $a = $(event.currentTarget); // reply-comment btn
		var $elem = $a.closest('.toggleable');
		var newComment = new Tumblero.Models.Comment({
			post: this.post
		});
		
		if ($a.data("parent_id")) {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				parent_id: $a.data("parent_id"),
				collection: this.model.child_comments(),
				post: this.post,
				postView: this.postView
			});
		} else {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				collection: this.model.child_comments(),
				post: this.post,
				postView: this.postView
			});
		}
		
		$elem.replaceWith(newCommView.render().$el);

// 		$a.replaceWith(newCommView.render().$el);
	},
	
	setFollowState: function(btnId){
		var isFollowed = this.currentUser.followStateFor(this.blog_id);
		this.followState = ((isFollowed) ? "followed" : "unfollowed");
		
		this.btnId = (btnId || ('button.follow-btn'));
	},
	
	render: function(){		
		this.setLikeState('Comment', this.model.id, this.likeButtonId);
		this.setFollowState(this.followBtnId);
		
		var content = this.template({ 
			comment: this.model,
			initialLikeState: this.likeState,
			main_blog_id: this.blog_id,
			initialFollowState: this.followState,
			shouldShowFollow: this.shouldShowFollow
		});
		
    this.$el.html(content);
		
    this.addAllComments();
		
		this.renderLikeButton(this.likeButtonId);
		this.renderFollowButton(this.followBtnId);
    return this;
	}
});