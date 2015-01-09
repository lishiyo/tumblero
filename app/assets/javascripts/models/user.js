Tumblero.Models.User = Backbone.Model.extend({
	urlRoot: '/api/users',
	
	toJSON: function(){ // nest everything under user
		return { user: this.attributes }
	},
	
	likeStateFor: function(post_id){
		var user = this;
		
		return user.get('liked_posts').some(function(elem){
			return (elem.id === post_id);
		});
	},
	
	followStateFor: function(blog_id) {	
		return this.blogs().some(function(elem){
			return (elem.id === blog_id);
		});
	},
	
	blogs: function(){
		if (!this._blogs) {
			this._blogs = new Tumblero.Collections.Blogs([], {
				user: this
			});
		}
		
		return this._blogs;
	},
	
	
	parse: function(resp){
		if (resp.blogs) {
			this.blogs().set(resp.blogs, { parse: true });
			delete resp.blogs
		}	
		
// 		if (resp.liked_posts) {
// 			resp.liked_posts_ids = [];
// 			resp.liked_posts.forEach(function(post){
// 				resp.liked_posts_ids.push(post.id);
// 			});
// 		}
		
		console.log("parse resp", resp);
		return resp;
	}
})