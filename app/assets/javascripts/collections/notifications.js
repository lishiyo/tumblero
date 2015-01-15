Tumblero.Collections.Notifications = Backbone.Collection.extend({
	
	url: function(){
		if (this._type === "note") {
			return this.user.url() + "/notes";
		} else {
			return this.user.url() + "/notifications";
		}
	},
	
	initialize: function(opts) {
		this.user = opts.user;
		this._type = opts._type;
	}
	
});
	