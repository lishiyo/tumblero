Tumblero.Views.PostShow = Tumblero.ToggableView.extend({
	
	template: JST['posts/show'],
	events: {
		"click .open-comments": "openComments",
		'click button.like-btn': "likeSubject"
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
		console.log("clicked openComments");
		
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
				
			}
		});
	},
	
		
	render: function(){
		
		this.setLikeState('Post', this.model.id);
		
		var content = this.template({ 
			post: this.model,
			initialLikeState: this.likeState,
			tag_names: this.model.taggings()
		});
		
    this.$el.html(content);
   	
		this.renderLikeButton(this.$('.like-btn'));
		
    return this;
	}
	
	
});