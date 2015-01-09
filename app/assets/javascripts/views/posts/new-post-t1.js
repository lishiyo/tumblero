Tumblero.Views.NewPostT1 = Tumblero.PostModal.extend({
	template: JST['posts/newPostT1'],
	
	events: {
		"click .upload-fp": 'upload',
	},
	
	initialize: function(opts){
// 		$(".modal").removeClass("is-open");
		this.blogs = opts.current_user.blogs();
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
		
		var content = this.template({ post: this.model, blogs: this.blogs });
		this.$el.html(content);
		console.log("rendering in Tab1", this.$el);
		this.onShow();
// 		this.setActive({ tabNum: 1 });
		
// 		this.$(".modal").addClass("is-open");
		return this;
	}
});
		