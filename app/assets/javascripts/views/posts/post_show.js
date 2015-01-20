Tumblero.Views.PostShow = Tumblero.ToggableView.extend({
	
	template: JST['posts/show'],
	
	className: "post-show",
	
	events: {
		"click .open-comments": "openComments",
		'click button.like-btn': "likeSubject",
		"click .reblog-btn": "openReblogModal",
		'click .edit-post': "openEditPost",
		'submit form.edit-form': "submitEditForm",
		'click .delete-post': 'deletePost'
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
		
		this.currentUser.fetch();
		this.listenTo(this.currentUser, 'sync', this.setupEditable);
		this.listenTo(this.model, 'sync destroy', this.render);
		this.listenTo(this.model, 'change:comments_count', this.incrementCommCount);
		this.listenTo(this.taggings, 'sync', this.render);
	},
	
	deletePost: function(event){
		event.preventDefault();
		this.deleteBtn.confirmation('show');
	},
	
	setupEditable: function() {
		var isOwnBlog = function(id) { 
			return id == this.blog_id; 
		}.bind(this)
		
		if (this.currentUser.get('blog_ids').some(isOwnBlog)) {
			this.$('.editable').removeClass('hidden');
		}
		
		this.deleteBtn = this.$('.delete-post');
		var post = this.model;
		
		this.deleteBtn.confirmation({
			popout: true,
			onConfirm: function(event){
				event.preventDefault();
				post.destroy({
					success: function(){
						console.log("destroyed!");
					}
				})
			}
		});
	},
	
	openEditPost: function(event) {
		event.preventDefault();
		var editForm = JST['posts/edit_post'];
		var content = editForm({ post: this.model });
		
		this.$('.post-inner').html(content);
		
		// attach wysiwyg content
		this.setEditor();
		if (this.model.get('content')) {
			this.$('#post-content').html(this.model.get('content'));
		}
	},
	
	submitEditForm: function(event) {
		event.preventDefault();
		var formData = $(event.currentTarget).serializeJSON().post;
		
		this.model.save(formData, {
			success: function(model) {		
				console.log("post updated!")
				model.fetch();
			},
			error: function() {
				console.log("something went wrong");
			}
		});
		
	},
	
	setEditor: function(){
		this.$('#post-content').wysihtml5({
			toolbar: {
				"font-styles": true, 
				"emphasis": true, //Italics, bold, etc. Default true
				"lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
				"html": false, //Button which allows you to edit the generated HTML. Default false
				"link": false, 
				"image": false, 
				"color": true, //Button to change color of font  
				"blockquote": true, //Blockquote  
				"fa": true
			}
		});
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
	
	render: function(){
		this.setLikeState('Post', this.model.id, this.likeButtonId);
		var content = this.template({ 
			post: this.model,
			initialLikeState: this.likeState,
			tag_names: this.taggings,
			count_comments: this.model.get('comments_count'),
			main_blog_id: this.blog_id,
			shouldShowFollow: this.shouldShowFollow
		});
		
    this.$el.html(content);
   	
		this.renderLikeButton(this.likeButtonId);
		
		this.setFollowState(this.followBtnId, this.blog_id); // "button.follow-btn-" + this.blog_id;
		this.renderFollowButton(this.followBtnId);
		
		
// 		this.setupEditable();
    return this;
	}
	
	
});