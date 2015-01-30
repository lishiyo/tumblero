Tumblero.Views.BlogSettings = Tumblero.Filepickerable.extend({
	template: JST['blogs/settings'],
	
	events: {
		"submit form": "updateBlog",
		"click .upload-fp": 'upload',
		"change #blog_handle": "showHandle"
	},
	
	initialize: function(opts){
		this.blogs = opts.currentUser.blogs();
		
		this.listenTo(this.model, 'sync change', this.render);
		this.listenTo(this.model, 'invalid', this.noteInvalid);
		
		this.listenTo(this.blogs, 'change add sync', this.render);
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
	
	updateBlog: function(event){
		event.preventDefault();
		var formData = $(event.currentTarget).serializeJSON().blog,
				view = this;

		this.model.save(formData, {
			success: function(){
				console.log("successful update of blog");
				view.blogs.add(view.model, { merge: true });
				view.alertNotification("successful update");
				view.remove();
			},
			error: function(model, response){
				view.alertNotification("something went wrong");
				console.log("something went wrong", response);
			}
		})
	},
	
	alertNotification: function(content){
		var note = $('<span></span>').html(content).addClass('hidden');
		$('.inline-notifications').removeClass('hidden').prepend(note);
		note.removeClass('hidden').fadeToggle( 1000, "linear" );
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