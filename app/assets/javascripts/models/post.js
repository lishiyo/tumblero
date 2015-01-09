Tumblero.Models.Post = Backbone.Model.extend({
	urlRoot: "/api/posts",
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
		console.log("hitting parse in post", resp);
		if (resp.taggings) {
			console.log("setting taggings", resp.taggings);
			this.taggings().set(resp.taggings, { parse: true });
			delete resp.taggings;
		} 
			
		return resp;
	}
	
})