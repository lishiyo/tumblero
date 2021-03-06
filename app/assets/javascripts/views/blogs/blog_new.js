Tumblero.Views.BlogNew = Tumblero.Filepickerable.extend({
	template: JST['blogs/new'],
	
	events: {
		"submit form": "createBlog",
		"click .upload-fp": 'upload',
		"keyup #blog_handle": "showHandle"
	},
	
	initialize: function(opts){
		this.currentUser = opts.currentUser;
		this.listenTo(this.model, 'invalid', this.noteInvalid);
	},
	
	showHandle: function(event){
		var input = $(event.currentTarget).val();
		var newHandle = input.toLowerCase().replace(/\s+/g, "-");
		$('span.tumblero-url').text(newHandle);
	},
	// override filepickerable
	upload: function (event) {	
		event.preventDefault();
		this.setImageOpts();
		
		filepicker.pick({
			maxFiles: 10,
			folders: true,
			maxSize: 1024*1024,
			container: 'modal'
		}, function(blobs) {
			this.processImages(blobs, this.imageOpts);
			
		}.bind(this));
	},
	
	processImages: function(blob, opts) {
		
		opts.inputVal = opts.inputVal.split(",").concat(blob.url).filter(function(v){ return v!==''}).toString();
		opts.$input.val(opts.inputVal);
		
		// add image to preview and imagePreviewArr
		var $image = $('<img>').attr('src', blob.url);
		opts.$imageArr.push($image);
		opts.$previews.append($image);
		opts.$previews.append(opts.xBtn);
	},
	
	createBlog: function(event){
		event.preventDefault();
		var formData = $(event.currentTarget).serializeJSON().blog,
				view = this;

		this.model.save(formData, {
			success: function(){
				console.log("successful creation of blog");
				view.$('.inline-notifications').addClass("hidden");
				view.currentUser.blogs().add(view.model);
				Backbone.history.navigate("/blogs/"+view.model.id, { 
					trigger: true });
			},
			error: function(model, response){
				view.$('.inline-notifications').html("something went wrong").removeClass("hidden");
				console.log("something went wrong", response);
			}
		})
	},
	
	noteInvalid: function(model, error) {
		var note = model.get('handle') + " " + error;
		this.$('.inline-notifications').html(note).removeClass("hidden");
	},
	
	render: function(){
		var content = this.template({ blog: this.model });
		this.$el.html(content);
		
		return this;
	}
	
});