Tumblero.Views.NewPostT2 = Tumblero.PostModal.extend({
	
	template: JST['posts/newPostT2'],
	
	events: {
		"submit form": "submitForm"
	},
	
	initialize: function(opts){
		console.log("initialized T2");
		$(".modal").removeClass("is-open");
		this.blog_id = opts.blog_id;
	},
	
	render: function(){
		var content = this.template({ post: this.model, blog_id: this.blog_id });
		this.$el.html(content);
		
		this.setActive({ tabNum: 2 });
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