Tumblero.Models.User = Backbone.Model.extend({
	urlRoot: '/api/users',
	
	toJSON: function(){ // nest everything under user
		return { user: this.attributes }
	},
	
	likeStateFor: function(type, type_id){
		var user = this;
// 		console.log("likestatefor", user, user.get('liked_posts_ids'))
		
		if (type == 'Post') {
			return user.get('liked_posts_ids').some(function(elem){
				return (elem === type_id);
			});
		} else if (type == 'Comment') {
			return user.get('liked_comments_ids').some(function(elem){
				return (elem === type_id);
			});
		}
			
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
		
		return resp;
	}
})