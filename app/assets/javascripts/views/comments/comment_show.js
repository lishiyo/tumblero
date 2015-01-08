Tumblero.Views.CommentShow = Backbone.CompositeView.extend({
	
	template: JST['comments/_comment'],
	
	tagName: "li",
	
	className: "child-comment",
	
	id: function(){
		var contEl = "#comment-show-"+this.model.id;
		return contEl;
	},
	
	// this.model = comment with child_comments
	initialize: function(){
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.child_comments(), 'sync add remove', this.render);
		
		// add subviews for child_comments
		if (this.model.child_comments().length > 0) {
			this.model.child_comments().each(function(comment){
			console.log("attaching CommentShow sub: ", comment, this.model)
			this.addCommSubview(comment);
		}.bind(this));
		}
		
	},
	
	addCommSubview: function(comment) {
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment
    });
    this.addSubview("#more-child-comment-"+this.model.id, commentSubview);
	},
	
	render: function(){
		
		var content = this.template({ comment: this.model });
		console.log("this.$el", this.$el);
    this.$el.html(content);
    this.attachSubviews();

    return this;
	}
});