Tumblero.Models.Post = Backbone.Model.extend({
	urlRoot: "/api/posts",
	
	toJSON: function(){ // nest everything under user
		return { post: this.attributes }
	},
	
	initialize: function(opts){
	},
	
	taggings: function(){
		if(!this._taggings) {
      this._taggings = new Tumblero.Collections.Taggings([], {
        post: this,
      });
    }
		
    return this._taggings;
	},
	
	parse: function(resp) {
		if (resp.taggings) {
			this.taggings().set(resp.taggings, { parse: true });
			// array of tag names
			resp.tagNames = resp.taggings.map(function(obj){
				return obj.name;
			});
			
			delete resp.taggings;
		} 
			
		return resp;
	}
	
})