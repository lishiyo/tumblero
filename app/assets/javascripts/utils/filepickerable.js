Tumblero.Filepickerable = Backbone.View.extend({
	
	setImageOpts: function(){
		this.uploadNum = this.uploadNum || 0;
		var $previews = this.$('div.image-thumbnails');
		var $input = this.$('#filepicker_urls');
		var inputVal = $input.val();
		var xBtn = $('<i class="fa fa-times"></i>').data("upload-num", this.uploadNum);
		var $imageArr = [];
		
		// clear out all pics 
		xBtn.on('click', function(event){
			console.log("clicked xBtn");
			event.preventDefault();
			$input.val("");
			$previews.empty();
		});
		
		this.imageOpts = {
			$previews: $previews,
			$input: $input,
			inputVal: inputVal,
			$imageArr: $imageArr,
			xBtn: xBtn
		};
		
		return this.imageOpts;
	},
	
	// click upload in tab1
	upload: function (event) {
		event.preventDefault();
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
			
			// set input value
			opts.inputVal = opts.inputVal.split(",").concat(blob.url).filter(function(v){ return v!==''}).toString();
			opts.$input.val(opts.inputVal);
			
			// add image to preview and imagePreviewArr
			var $image = $('<img>').attr('src', blob.url);
			opts.$imageArr.push($image);
			opts.$previews.append($image);
		});
			
		opts.$previews.append(opts.xBtn);
	},
	
	
	
});