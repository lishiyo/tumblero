Tumblero.PostModal = Tumblero.Filepickerable.extend({
	
	initialize: function(){
		
	},
	
	setActive: function(opts) {
		event.preventDefault();
		this.$('.bbm-modal__tab a').removeClass('active');
		this.$('#tab'+opts.tabNum).addClass('active'); 
		
		var post = this.model,
				user = Tumblero.current_user;
		
		switch (opts.tabNum) {
			case 1:
				this.showTab1(post, user);
				break;
			case 2:
				this.showTab2(post, user);
				break;
			default:
				console.log("couldn't find tab");
		}
		
		this.$(".modal").addClass("is-open");
	},
	
	showTab1: function(post, user){
		var newPostT1 = new Tumblero.Views.NewPostT1({
			model: post,
			current_user: user
		});
		
		$('.tab-container').html(newPostT1.render().$el);
		console.log(this.$tabEl);
	},
	
	showTab2: function(post, user){
		var newPostT2 = new Tumblero.Views.NewPostT2({
			model: post,
			current_user: user
		});
		
		$('.tab-container').html(newPostT2.render().$el);
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
	
	submitForm: function(event) {
		event.preventDefault();
		var blogId = $('select#post_blog_id').val(),
				blog = Tumblero.Collections.blogs.getOrFetch(blogId);
		
		var formData = $(event.currentTarget).serializeJSON().post;
		var modalView = this;
		
		// create new post and save it
		var newPost = new Tumblero.Models.Post();
		newPost.save(formData, {
			success: function(model) {		
				blog.posts().add(newPost);
				modalView.submit(blog);	
				modalView.model.fetch();
			},
			error: function() {
				console.log("something went wrong")
			}
		});
		
	},
	
	submit: function(blog) {
		$(".modal").removeClass("is-open");
		var content = "<small>post added to <a href='/blogs/" + blog.id + "'>" + blog.get('name') + "</a></small>";
		var note = $('<span></span>').html(content).addClass('hidden');
		$('.inline-notifications').removeClass('hidden').prepend(note);
		note.removeClass('hidden').fadeToggle( 1000, "linear" );
		
		blog.fetch();
		
// 		if (Backbone.history.location.hash == ("#/blogs/"+blog.id) || Backbone.history.location.hash == ("#blogs/"+blog.id)) {
			
// 			Backbone.history.navigate("/blogs/"+blog.id, { trigger: true });
// 		}
		// add to collection?
// 		window.location.replace("/dashboard");
	}
	
});