Tumblero.Views.PostShow = Tumblero.ToggableView.extend({
	
	template: JST['posts/show'],
	events: {
		"click .open-comments": "openComments",
		'click button.like-btn': "likeSubject",
		"click .reblog-btn": "openReblogModal",
	},
	
	initialize: function(opts){
		this.blog = opts.blog;
		this.currentUser = opts.currentUser;
		this.taggings = this.model.taggings();
// 		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.model, 'sync change', this.render);
		this.listenTo(this.taggings, 'sync', this.render);
		this.likeButtonId = ('button.like-post');
		
// 		this.model.fwd = Backbone.fwd;
		
	},
	
	openReblogModal: function(event){
		
		event.preventDefault();
		var post = this.model;
		
		post.fetch({
			success: function(model) {
				console.log("setReblogModal got post: ", model);
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
		var user = this.currentUser;
		
		all_comments.fetch({
			success: function(){
				var commentsIndex = new Tumblero.Views.CommentsIndex({ 
					collection: all_comments,
					currentUser: user
				});

				$commCont.html(commentsIndex.render().$el);
			}
		});
	},
	
		
	render: function(){
		
		this.setLikeState('Post', this.model.id, this.likeButtonId);
		
		var content = this.template({ 
			post: this.model,
			initialLikeState: this.likeState,
			tag_names: this.taggings
		});
		
    this.$el.html(content);
   	
		this.renderLikeButton(this.likeButtonId);
		
    return this;
	}
	
	
});