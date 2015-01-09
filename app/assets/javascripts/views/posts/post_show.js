Tumblero.Views.PostShow = Backbone.View.extend({
	
	template: JST['posts/show'],
	events: {
		"click .open-comments": "openComments"
	},
	
	initialize: function(opts){
		this.blog = opts.blog;
		this.currentUser = opts.currentUser;
		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.taggings(), 'sync', this.render);
		
	},
	
	openComments: function(event){
		event.preventDefault();
		
		var commCont = '#post-comments-' + this.model.id;
		var $commCont = $(commCont);
		
		var all_comments = new Tumblero.Collections.Comments({ post: this.model });
		var cu = this.currentUser;
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
		var isLiked = this.currentUser.likeStateFor('Post', this.model.id);
		
		var likeState = (isLiked) ? "liked" : "unliked";
		
		var tagArr = this.model.taggings().map(function(tagModel){
			return tagModel.get('name');
		});
		
		console.log("tagarr", this.model.taggings());
		
		var content = this.template({ 
			post: this.model,
			initialLikeState: likeState,
			tag_names: tagArr
		});
		
    this.$el.html(content);
   
		
    return this;
	}
	
	
});