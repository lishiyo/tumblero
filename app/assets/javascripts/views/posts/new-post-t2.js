Tumblero.Views.NewPostT2 = Tumblero.PostModal.extend({
	
	template: JST['posts/newPostT2'],
	
	events: {
	},
	
	initialize: function(opts){
		this.blogs = opts.current_user.blogs();
		this.blog = (opts.blog || null);
	},
	
	render: function(){
		console.log("rendering in Tab2");
		
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);

		this.makeDropPane();
		
		return this;
	},
	
	makeDropPane: function(){
		
		var targetPane = this.$('#dropPane'),
				view = this;
		
			filepicker.makeDropPane(targetPane[0], {
				multiple: true,
				dragEnter: function() {
					console.log("dragEnter");
					targetPane.html("Drop to upload").toggleClass('drag-enter');
				},
				dragLeave: function() {
					console.log("dragLeave");
					targetPane.html("Drop files here").toggleClass('drag-leave');
				},
				onSuccess: function(blobs) {
					targetPane.text("success!");
// 					$("#localDropResult").text(JSON.stringify(blobs));
					
					view.setImageOpts();
					view.processImages(blobs, view.imageOpts);
				},
				onError: function(type, message) {
					$("#localDropResult").text('('+type+') '+ message).removeClass('hidden');
				},
				onProgress: function(percentage) {
					targetPane.text("Uploading ("+percentage+"%)");
				}
			});

	}
})