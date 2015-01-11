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
	
// 	setImageOpts: function(){
// 		this.uploadNum = this.uploadNum || 0;
// 		var $previews = this.$('div.image-thumbnails');
// 		var $input = this.$('#filepicker_urls');
// 		var inputVal = $input.val();
// 		var xBtn = $('<i class="fa fa-times"></i>').data("upload-num", this.uploadNum);
// 		var $imageArr = [];
		
// 		// clear out all pics 
// 		xBtn.on('click', function(event){
// 			console.log("clicked xBtn");
// 			event.preventDefault();
// 			$input.val("");
// 			$previews.empty();
// 		});
		
// 		this.imageOpts = {
// 			$previews: $previews,
// 			$input: $input,
// 			inputVal: inputVal,
// 			$imageArr: $imageArr,
// 			xBtn: xBtn
// 		};
		
// 		return this.imageOpts;
// 	},
	
// 	// click upload in tab1
// 	upload: function (event) {
// 		event.preventDefault();
// 		this.setImageOpts();
		
// 		filepicker.pickMultiple({
// 			maxFiles: 10,
// 			folders: true,
// 			maxSize: 1024*1024,
// 			container: 'modal'
// 		}, function(blobs) {
// 			this.processImages(blobs, this.imageOpts);
			
// 		}.bind(this));
		
// 	},
	
// 	processImages: function(blobs, opts) {
// 		blobs.forEach(function(blob){
			
// 			// set input value
// 			opts.inputVal = opts.inputVal.split(",").concat(blob.url).filter(function(v){ return v!==''}).toString();
// 			opts.$input.val(opts.inputVal);
			
// 			// add image to preview and imagePreviewArr
// 			var $image = $('<img>').attr('src', blob.url);
// 			opts.$imageArr.push($image);
// 			opts.$previews.append($image);
// 		});
			
// 		opts.$previews.append(opts.xBtn);
// 	},
	
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
		var blogId = $('select#post_blog_id').val();
// 		var blog = (this.blog || new Tumblero.Models.Blog({ id: blogId }));
// 		blog.fetch();
		
		var formData = $(event.currentTarget).serializeJSON();
		var modalView = this;
		
		var post = new Tumblero.Models.Post();
		post.save(formData, {
			success: function(model) {
// 				blog.posts().add(post);
				this.submit(blogId);
				console.log("post saved to ", blog.posts());
			}.bind(this),
			error: function() {
				console.log("something went wrong")
			}
		});
		
	},
	
	submit: function(blogId) {
		$(".modal").removeClass("is-open");
		$('.inline-notifications').html("<h4>post added!</h4>").removeClass('hidden');
		
		console.log(Tumblero.Routers.Router.current());
		if (Tumblero.Routers.Router.current().params == blogId) {
			Backbone.history.navigate("/blogs/"+blogId, { trigger: true });
		}
		// add to collection?
// 		window.location.replace("/dashboard");
	}
	
});