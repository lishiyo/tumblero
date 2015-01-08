Tumblero.PostModal = Backbone.View.extend({
	
	setActive: function(opts) {
		this.$('.bbm-modal__tab a').removeClass('active');
		this.$('#tab'+opts.tabNum).addClass('active'); 
		
		this.$(".modal").addClass("is-open");
	},
	
	setImageOpts: function(){
		var $previews = this.$('div.image-thumbnails');
		var $input = this.$('#post_filepicker_urls');
		var inputVal = $input.val();
		var xBtn = $('<a href="#"><i class="icon-remove-sign">X</i></a>');
		// clear out all pics
		xBtn.on('click', function(event){
			console.log("clicked xBtn");
			event.preventDefault();
			$input.val("");
			$previews.empty();
		});
		
		var imageOpts = {
			$previews: $previews,
			$input: $input,
			inputVal: inputVal,
			xBtn: xBtn
		};
		
		this.imageOpts = imageOpts;
	},
	
	upload: function (event) {
		
		this.setImageOpts();
		
		filepicker.pickMultiple({
			maxFiles: 10,
			folders: true,
			maxSize: 1024*1024,
			container: 'modal'
		}, function(blobs) {
			this.processImages(blobs, this.imageOpts);
		}.bind(this));
		
	},
	
	processImages: function(blobs, opts) {
		blobs.forEach(function(blob){				
			opts.inputVal = opts.inputVal.split(",").concat(blob.url).filter(function(v){ return v!==''}).toString();

			opts.$input.val(opts.inputVal);
			var $image = $('<img>').attr('src', blob.url);
			opts.$previews.append($image);

		});
			
		opts.$previews.append(opts.xBtn);
	
	},
	
	// editor for tab1 and reblog form
	onShow: function(){
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
		
		var formData = $(event.currentTarget).serializeJSON();
		console.log("clicked submit", formData);
		var modalView = this;
		
		var post = new Tumblero.Models.Post();
		post.save(formData, {
			success: function(model) {
				console.log("post saved!", post);
				this.submit();
			}.bind(this),
			error: function() {
				console.log("something went wrong")
			}
		});
		
	},
	
	submit: function(event) {
		console.log("clicked submit");
		$(".modal").removeClass("is-open");
		// add to collection
		window.location.replace("/dashboard");
	}
	
});