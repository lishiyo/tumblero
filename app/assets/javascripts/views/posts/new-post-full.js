Tumblero.Views.NewPostFull = Tumblero.PostModal.extend({
	template: JST['posts/new-post-full'],
	
	events: {
		"click a#tab1": "callTab1",
		"click a#tab2": "callTab2",
		"click a#tab3": "callTab3",
		"click a#tab4": "callTab4",
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
		} else if (this.tabNum === 4) {
			this.createLinkContent(e);
		} else {
			this.submitForm(e);
		}
	},
	
	// FOR TAB 4 - sanitize url
	createLinkContent: function(e) {
		e.preventDefault();
		var url = this.$('#post-link').val(),
				title = this.$('#post-title').val();
		
		if (title.length > 0) {
			var link = "<h1><a target='_blank' href='" + url + "'>" + title + "</a></h1>";
		} else {
			var link = "<h1><a target='_blank' href='" + url + '">' + url + "</a></h1>"
		}
		
		var formData = $(e.currentTarget).serializeJSON();
		var content = this.$('#post-content').val();
		
		formData['post']['content'] = link + "<p>" + content + "</p>";
		console.log("createLinkContent", link, formData);
		
		this.submitForm(e, formData.post);
	},
	
	// FOR TAB 3 - sanitize QUOTE
	createPostContent: function(e) {
		e.preventDefault();
		var quote = this.$('#post-quote').val();
		var block = "<blockquote class='post-quote'><i class='fa fa-quote-left text-muted pull-left'></i>" + quote + "<i class='fa fa-quote-right text-muted pull-right'></i></blockquote>";
		
		var formData = $(e.currentTarget).serializeJSON();
		var content = this.$('#post-content').val();
		formData['post']['content'] = block + "<p>" + content + "</p>";
		
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
	
	callTab4: function(e) {
		e.preventDefault();
		this.setActive({ tabNum: 4 });
	},
	
	render: function() {	
		var content = this.template({ blogs: this.blogs });
		this.$el.html(content);		
		
		return this;
	}
});
		