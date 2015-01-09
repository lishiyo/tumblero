Tumblero.Views.NewPostT1 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT1'],
	
	events: {
		"click .upload-fp": 'upload',
		"submit form": "submitForm"
	},
	
	initialize: function(opts){
		$(".modal").removeClass("is-open");
		this.blogs = opts.current_user.blogs();
		this.$tabEl = $('.tab-container');
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
		console.log("blogs", this.blogs);
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);
		
		this.onShow();
// 		this.setActive({ tabNum: 1 });
		
		return this;
	}
});
		