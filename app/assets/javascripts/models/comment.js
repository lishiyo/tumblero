Tumblero.Models.Comment = Backbone.Model.extend({
	
	urlRoot: '/api/comments',
	
	initialize: function(opts){
		this.post = opts.post;
	},
	
	child_comments: function(){
		if(!this._child_comments) {
      this._child_comments = new Tumblero.Collections.Comments([], {
        parent_comment: this,
				post: this.post
      });
    }
		
    return this._child_comments;
	},
	
	parse: function(resp) {
		
		if (resp.child_comments) {
			this.child_comments().set(resp.child_comments, {parse: true});
			delete resp.child_comments;
		} 
			
		return resp;
	}
	
});