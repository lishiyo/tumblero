Tumblero.Views.PostShow = Tumblero.ToggableView.extend({
	
	template: JST['posts/show'],
	
	className: "post-show",
	
	events: {
		"click .open-comments": "openComments",
		'click button.like-btn': "likeSubject",
		"click .reblog-btn": "openReblogModal",
		'click button.follow-btn': "followPoster"
	},
	
	initialize: function(opts){
		this.blog_id = this.model.get('blog_id');
		this.currentUser = opts.currentUser;
		this.taggings = this.model.taggings();
		this.likeButtonId = ('button.like-post');
		this.followBtnId = "button.follow-btn-" + this.blog_id;
		
		if (this.blog_id === this.currentUser.get('main_blog_id')) {
			this.shouldShowFollow = false;
		} else {
			this.shouldShowFollow = true;
		}
		
// 		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change:comments_count', this.incrementCommCount);
		this.listenTo(this.taggings, 'sync', this.render);
		
	},
	
	followPoster: function(event){
		this.followBlog(event, this.blog_id);
	},
	
	incrementCommCount: function(){
		var $commCount = this.$('span.count-comments');
		var newCount = this.model.get('comments_count');

		$commCount.text(newCount);
	},
	
	openReblogModal: function(event){
		event.preventDefault();
		var post = this.model;
		
		post.fetch({
			success: function(model) {
				var reblogView = new Tumblero.Views.ReblogForm({
					model: post,
					currentUser: this.currentUser
				});

				$('.modal-container').html(reblogView.render().$el);
			}.bind(this), 

			error: function(model, resp) {
				console.log("setReblogModal error", model, resp);
			}
		});

	},
	
	openComments: function(event){
		event.preventDefault();
		var commCont = '#post-comments-' + this.model.id;
		var $commCont = $(commCont);
		var all_comments = new Tumblero.Collections.Comments({
			post: this.model 
		});
		
		all_comments.fetch({
			success: function(){
				var commentsIndex = new Tumblero.Views.CommentsIndex({ 
					collection: all_comments,
					currentUser: this.currentUser,
					post: this.model,
					postView: this
				});

				$commCont.html(commentsIndex.render().$el);
			}.bind(this)
		});
	},
	
	setFollowState: function(btnId){
		var isFollowed = this.currentUser.followStateFor(this.blog_id);
		this.followState = ((isFollowed) ? "followed" : "unfollowed");
		
		this.btnId = (btnId || ('button.follow-btn'));
	},
	
	render: function(){
		this.setLikeState('Post', this.model.id, this.likeButtonId);
		this.setFollowState(this.followBtnId);

		var content = this.template({ 
			post: this.model,
			initialLikeState: this.likeState,
			tag_names: this.taggings,
			count_comments: this.model.get('comments_count'),
			shouldShowFollow: this.shouldShowFollow,
			main_blog_id: this.blog_id,
			initialFollowState: this.followState
		});
		
    this.$el.html(content);
   	
		this.renderLikeButton(this.likeButtonId);
		this.renderFollowButton(this.followBtnId);
		
    return this;
	}
	
	
});