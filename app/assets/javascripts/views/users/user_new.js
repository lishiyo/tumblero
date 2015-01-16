Tumblero.Views.UserNew = Backbone.View.extend({
  template: JST['users/new'],

  events: {
    "submit form": "createUser"
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);
    return this;
  },

  createUser: function (event){
    event.preventDefault();
    var formData = $(event.currentTarget).serializeJSON().user;

    this.model.save(formData, {
      success: function(model, response, options) {
				console.log("saved new user", this.model);
				this.$('.errors').addClass('hidden');
				
				Tumblero.current_user = this.model;
				Tumblero.current_user.fetch();
        Backbone.history.navigate("explore/blogs", {trigger: true});
				Tumblero.Header.refresh();
				
//         window.location.replace("#/blogs/new");
      }.bind(this),
			error: function(model, response, options){
				console.log(model, response, options);
				var res = $.parseJSON(response.responseText).join(", ");
				this.$('.errors').html(res).removeClass('hidden');
			}.bind(this)
    });
  }
})
