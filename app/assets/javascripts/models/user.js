Tumblero.Models.User = Backbone.Model.extend({
	urlRoot: 'api/users',
	
	toJSON: function(){ // nest everything under user
		return { user: this.attributes }
	}
})