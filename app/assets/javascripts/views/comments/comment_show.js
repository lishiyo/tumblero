Tumblero.Views.CommentShow = Backbone.CompositeView.extend({
	
	template: JST['comments/_comment'],
	
	// this.model = child_comment
	initialize: function(){
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model.child_comments(), 'sync add remove', this.render);
		
		this.model.child_comments().each(function(comment){
			console.log("attaching subview of: ", comment, this.model)
			this.addCommSubview(comment);
		}.bind(this));
	},
	
	addCommSubview: function(comment) {
		var commentSubview = new Tumblero.Views.CommentShow({
      model: comment
    });

    this.addSubview("ul.child-comments-cont", commentSubview);
	},
	
	render: function(){
		var content = this.template({ comment: this.model });
    this.$el.html(content);

    this.attachSubviews(); // renders lists

    return this;
	}
});