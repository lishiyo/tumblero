Tumblero.Views.BlogsExplore = Backbone.CompositeView.extend({
	
	template: JST['blogs/explore'],
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.collection, 'sync', this.addAllBlogs);
	},
	
	addAllBlogs: function(){
		// add subviews for blog
		this.collection.each(function(blog){
			this.addBlogSubview(blog);
		}.bind(this));
		
		this.initMasonry();
		this.addFooter();
	},
	
	initMasonry: function(){
		var $container = $('#masonry');
		$container.masonry({
// 			columnWidth: 200,
			itemSelector: '.item',
			gutter: 20
		});			
	},
	
	addBlogSubview: function(blog){
		var subview = new Tumblero.Views.BlogProfile({
      model: blog,
			collection: this.collection,
			currentUser: this.currentUser
    });
		
    this.addSubview(".blogs-index", subview);
	},
	
	addFooter: function(){
		$('button#new-blog').removeClass('hidden');
		$('.follow-up').removeClass('hidden');
	},
	
	render: function(){
		var content = this.template();
    this.$el.html(content);
    return this;
	}
	
	
});