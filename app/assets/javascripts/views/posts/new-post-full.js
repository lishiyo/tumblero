Tumblero.Views.NewPostFull = Tumblero.PostModal.extend({
	template: JST['posts/new-post-full'],
	
	events: {
		"click a#tab1": "callTab1",
		"click a#tab2": "callTab2",
		"click a#tab3": "callTab3",
		"submit form": "submitFormCheck"
	},
	
	initialize: function(opts) {
		this.currentUser = opts.currentUser;
		this.blogs = opts.currentUser.blogs();
		this.$tabEl = $('.tab-container');
		this.blog = (opts.blog || null);
		$(".modal").removeClass("is-open");
	},
	
	submitFormCheck: function(e) {
		e.preventDefault();
		if (this.tabNum === 3) {
			this.createPostContent(e);
		} else {
			this.submitForm(e);
		}
	},
	
	createPostContent: function(e){
		e.preventDefault();
		var quote = this.$('#post-quote').val();
		var block = "<i class='fa fa-quote-left text-muted pull-left'></i>" + quote + "<i class='fa fa-quote-right text-muted pull-right'></i>";
		
		var formData = $(e.currentTarget).serializeJSON();
		var source = this.$('#post-content').val();
		formData['post']['content'] = block + "<p>" + source + "</p>";
		
		this.submitForm(e, formData);
	},
	
	callTab1: function() {
		this.setActive({ tabNum: 1 });
	},
	
	callTab2: function() {
		this.setActive({ tabNum: 2 });
	},
	
	callTab3: function() {
		this.setActive({ tabNum: 3 });
	},
	
	render: function() {	
		var content = this.template({ blogs: this.blogs });
		this.$el.html(content);		
		
		return this;
	}
});
		