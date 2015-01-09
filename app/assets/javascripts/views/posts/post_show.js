Tumblero.Views.PostShow = Backbone.View.extend({
	
	template: JST['posts/show'],
	events: {
		"click .open-comments": "openComments"
	},
	
	initialize: function(opts){
		this.blog = opts.blog;
		this.currentUser = opts.currentUser;
		this.listenTo(this.model, 'sync', this.render);
		
	},
	
	openComments: function(event){
		event.preventDefault();
		
		var commCont = '#post-comments-' + this.model.id;
		var $commCont = $(commCont);
		
		var all_comments = new Tumblero.Collections.Comments({ post: this.model });
		all_comments.fetch({
			success: function(){
				var commentsIndex = new Tumblero.Views.CommentsIndex({ collection: all_comments });

				$commCont.html(commentsIndex.render().$el);
			}
		});
	},
	
		
	render: function(){
		var post_id = this.model.id,
				isLiked = this.currentUser.likeStateFor(post_id),
				likeState;
		
		likeState = (isLiked) ? "liked" : "unliked";
		
		var content = this.template({ 
			post: this.model,
			initialLikeState: likeState
		});
		
    this.$el.html(content);
    
    return this;
	}
	
	
});