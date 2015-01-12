Tumblero.PostModal = Tumblero.Filepickerable.extend({
	
	initialize: function(){
		
	},
	
	setActive: function(opts) {
		
		this.$('.bbm-modal__tab a').removeClass('active');
		this.$('#tab'+opts.tabNum).addClass('active'); 
		this.tabNum = opts.tabNum;
		
		var post = this.model,
				user = Tumblero.current_user;
		
		switch (opts.tabNum) {
			case 1:
				this.showTab1(post, user);
				break;
			case 2:
				this.showTab2(post, user);
				break;
			case 3:
				this.showTab3(post, user);
			default:
				console.log("couldn't find tab");
		}
		
		this.$(".modal").addClass("is-open");
	},
	
	closeModal: function(event){
		event.preventDefault();
		$(".modal").removeClass("is-open");
	},
	
	showTab1: function(post, user){
		var view = new Tumblero.Views.NewPostT1({
			model: post,
			currentUser: user
		});
		
		$('.tab-container').html(view.render().$el);
	},
	
	showTab2: function(post, user){
		var view = new Tumblero.Views.NewPostT2({
			model: post,
			currentUser: user
		});
		
		$('.tab-container').html(view.render().$el);
	},
	
	showTab3: function(post, user) {
		var view = new Tumblero.Views.NewPostT3({
			model: post,
			currentUser: user
		});
		
		$('.tab-container').html(view.render().$el);
	},
	
	// editor for tab1 and reblog form
	setEditor: function(){
		this.$('#post-content').wysihtml5({
			toolbar: {
				"font-styles": true, 
				"emphasis": true, //Italics, bold, etc. Default true
				"lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
				"html": false, //Button which allows you to edit the generated HTML. Default false
				"link": false, 
				"image": false, 
				"color": true, //Button to change color of font  
				"blockquote": true, //Blockquote  
				"fa": true
			}
		});
	},
	// create a new post
	submitForm: function(event, data) {
		event.preventDefault();
		
		// blog post is submitting to
		var blogId = $('select#post_blog_id').val(),
				blog = Tumblero.Collections.blogs.getOrFetch(blogId),
				modalView = this;
		
		var formData = (data || $(event.currentTarget).serializeJSON().post);
		
		console.log("submitting new post", formData);
		// create new post and save it
		var newPost = new Tumblero.Models.Post();
		newPost.save(formData, {
			success: function(model) {		
				blog.posts().add(newPost);
				modalView.submit(blog);	
				blog.fetch();
			},
			error: function() {
				console.log("something went wrong");
			}
		});
		
	},
	
	alertSuccess: function(blog){
		var content = "<small>post added to <a href='/blogs/" + blog.id + "'>" + blog.get('name') + "</a></small>";
		var note = $('<span></span>').html(content).addClass('hidden');
		$('.inline-notifications').removeClass('hidden').prepend(note);
		note.removeClass('hidden').fadeToggle( 1000, "linear" );
	},
	
	submit: function(blog) {
		$(".modal").removeClass("is-open");		
// 		this.alertSuccess(blog);		
		blog.fetch();
		
// 		if (Backbone.history.location.hash == ("#/blogs/"+blog.id) || Backbone.history.location.hash == ("#blogs/"+blog.id)) {
			
// 			Backbone.history.navigate("/blogs/"+blog.id, { trigger: true });
// 		}
		// add to collection?
// 		window.location.replace("/dashboard");
	}
	
});