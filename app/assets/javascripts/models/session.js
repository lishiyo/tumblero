Tumblero.Models.Session = Backbone.Model.extend({
	urlRoot: '/session',
	
	toJSON: function(){ // nest everything under user
		return { user: this.attributes }
	}
})