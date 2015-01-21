Tumblero.Views.BlogSidebar = Tumblero.ToggableView.extend({
	
	template: JST['blogs/sidebar'],
	
	events: {
		'click a.blog-select': "selectBlog"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.collection = opts.blogs;
		this.main_blog = opts.main_blog;
	},
	
	diff: function(first, second) {
		return first.filter(function(elem) { 
			return (second.indexOf(elem) < 0)
		});
	},
		
	selectBlog: function(e){
		e.preventDefault();
		var blog = this.collection.getOrFetch($(e.currentTarget).data("blog-id"));
		
		var content = JST["blogs/sidebarBlog"]({ blog: blog });
		
		this.$('.sidebar-blog-profile').empty().html(content);
	},
	
	attachMainBlog: function(){
		var content = JST["blogs/sidebarBlog"]({ blog: this.main_blog });
		this.$('.sidebar-blog-profile').empty().html(content);
	},
	
	render: function(){
		var content = this.template({ 
			main_blog: this.main_blog,
			other_blogs: this.collection
		});
		
		this.$el.html(content);
		this.attachMainBlog();
		return this;
	},
	
});





