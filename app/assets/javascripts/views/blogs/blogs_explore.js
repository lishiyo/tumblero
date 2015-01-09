Tumblero.Views.BlogsExplore = Backbone.CompositeView.extend({
	
	template: JST['blogs/explore'],
	events: {
		
	},
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.currentUser, 'sync', this.render);
		this.listenTo(this.collection, 'sync add remove', this.render);

		// add subviews for blog
		this.collection.each(function(blog){
			this.addBlogSubview(blog);
		}.bind(this));
		
	},
	
	addBlogSubview: function(blog){
		var subview = new Tumblero.Views.BlogProfile({
      model: blog,
			collection: this.collection,
			currentUser: this.currentUser
    });
		
		console.log("adding blog profile", this.collection);
    this.addSubview(".blogs-explore-index", subview);
	},
	
	render: function(){
		
		var content = this.template();
    this.$el.html(content);
    this.attachSubviews();
		
		
    return this;
	}
	
	
});