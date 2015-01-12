Tumblero.Models.User = Backbone.Model.extend({
	urlRoot: '/api/users',
	
	toJSON: function(){ // nest everything under user
		return { user: this.attributes }
	},
	
	currLikeState: null,
	
	currFollowState: null,
	
	likeStateFor: function(type, type_id){
		var user = this;	
		
		if (type == 'Post' && user.get('liked_posts_ids')) {
			return user.get('liked_posts_ids').some(function(elem){
				return (elem === type_id);
			});
		} else if (type == 'Comment' && user.get('liked_comments_ids')) {
			return user.get('liked_comments_ids').some(function(elem){
				return (elem === type_id);
			});
		}
		
		return false;
	},
	
	followStateFor: function(blog_id) {	
		var user = this;
	
		if (user.get('followed_blogs_ids')) {
			return user.get('followed_blogs_ids').some(function(id){
				return (id === blog_id);
			});
		}
		
		
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