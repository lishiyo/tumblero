Tumblero.Collections.Comments = Backbone.Collection.extend({
	url: function(){
		return this.post.url() + "/comments.json"
	},
	
	model: Tumblero.Models.Comment,
	
	initialize: function(opts){
		this.post = opts.post;
		this.parent_comment = opts.parent_comment || null;
	},
	
	// grab comments_by_parent hash and parse out top level comments
	// do a fetch on each key (root comment) with parse: true
	// parse out a comment model returns comment.child_comments()
	parse: function(resp) {
		var root_comments = [];
		var hash = resp.comments_by_parent;
		
		for (var parent_id in hash) {
			if (parent_id.length === 0) { // root comment
				root_comments = hash[parent_id.length]; // array of root comments
			}
		}
		
		return root_comments;
	}
	
	
});