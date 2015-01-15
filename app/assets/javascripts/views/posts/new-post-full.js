Tumblero.Views.NewPostFull = Tumblero.PostModal.extend({
	template: JST['posts/new-post-full'],
	
	events: {
		"click a#tab1": "callTab1",
		"click a#tab2": "callTab2",
		"click a#tab3": "callTab3",
		"submit form": "submitFormCheck",
		"click .js-modal-close": "closeModal"
	},
		
	initialize: function(opts) {
		this.currentUser = (opts.currentUser || Tumblero.current_user);
		this.blogs = this.currentUser.blogs();
		
		this.$tabEl = $('.tab-container');
		// if coming from a blog
		this.blog = (opts.blog || null);
		this.collection = (opts.collection || null);
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
		
// 		console.log("in tab 3", formData);
		this.submitForm(e, formData.post);
	},
	
	callTab1: function(e) {
		e.preventDefault();
		this.setActive({ tabNum: 1 });
	},
	
	callTab2: function(e) {
		e.preventDefault();
		this.setActive({ tabNum: 2 });
	},
	
	callTab3: function(e) {
		e.preventDefault();
		this.setActive({ tabNum: 3 });
	},
	
	render: function() {	
		var content = this.template({ blogs: this.blogs });
		this.$el.html(content);		
		
		return this;
	}
});
		