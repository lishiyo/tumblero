Tumblero.Views.CommentsIndex = Backbone.CompositeView.extend({
	
	template: JST['comments/index'],
	
	events: {
		'click .close-comments': 'closeComments',
		'click .reply-comment': 'openReplyForm'
	},
	
	initialize: function(opts){
		// this.collection is all_comments
		this.listenTo(this.collection, 'remove change', this.render);
		this.listenTo(this.collection, 'add', this.render);
		this.post = this.collection.post;
		this.currentUser = opts.currentUser;
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
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment,
			post: this.post,
			currentUser: this.currentUser
    });

		var contId = "#comments-index-"+this.post.id;
	
    this.addSubview(contId, commentSubview);
	},
	
	render: function(){
		var content = this.template({ 
			post_id: this.post.id
		});
		
		var $close = $('<a class="close-comments" href="">close</a>');
		this.$el.html(content).append($close);
		// attach child comments subviews
		this.addAllRoots();
		
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
		});
		
		if ($a.data("parent_id")) {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				parent_id: $a.data("parent_id"),
				collection: this.collection,
				post: this.post,
				currentUser: this.currentUser
			});
		} else {
			var newCommView = new Tumblero.Views.CommentNew({
				model: newComment,
				collection: this.collection,
				post: this.post,
				currentUser: this.currentUser
			});
		}
		
		$a.replaceWith(newCommView.render().$el);
		
	}
	
	
})