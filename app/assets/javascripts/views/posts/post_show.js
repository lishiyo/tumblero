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
		var cu = this.currentUser;
		console.log("cu", cu);
		all_comments.fetch({
			success: function(){
				var commentsIndex = new Tumblero.Views.CommentsIndex({ 
					collection: all_comments,
					currentUser: cu
				});

				$commCont.html(commentsIndex.render().$el);
				
				console.log($("button.like-btn"));
				$("button.like-btn.like-comment").likeToggle();
			}
		});
	},
	
		
	render: function(){
		var isLiked = this.currentUser.likeStateFor('Post', this.model.id),
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