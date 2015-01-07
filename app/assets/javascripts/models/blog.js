Tumblero.Models.Blog = Backbone.Model.extend({
	urlRoot: '/blogs',
	initialize: function(opts) {
		this.user = opts.user;
	}
});