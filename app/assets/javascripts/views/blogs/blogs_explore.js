Tumblero.Views.BlogsExplore = Backbone.CompositeView.extend({
	
	template: JST['blogs/explore'],
	
	events: {
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
// 		this.listenTo(this.currentUser, 'sync', this.render);
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
	
// 	goNext: function(){
// 		Backbone.history.navigate("blogs/new", {trigger: true});
// 	},
	
	render: function(){
		var content = this.template();
    this.$el.html(content);
// 		this.addFooter();		
//     this.attachSubviews();
    return this;
	}
	
	
});