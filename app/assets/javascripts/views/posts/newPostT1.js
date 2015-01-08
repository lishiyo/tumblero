Tumblero.Views.NewPostT1 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT1'],
	
	events: {
		"click .upload-fp": 'upload',
		"submit form": "submitForm"
	},
	
	initialize: function(opts){
		this.blog_id = opts.blog_id;
		$(".modal").removeClass("is-open");
	},
	
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
	
	render: function(){
		var content = this.template({ post: this.model, blog_id: this.blog_id });
		this.$el.html(content);
		
		this.onShow();
		this.setActive({ tabNum: 1 });
		
		return this;
	}
});
		