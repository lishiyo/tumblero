Tumblero.Views.SessionNew = Backbone.View.extend({
  template: JST['users/session'],

  events: {
    "submit form": "createSession"
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);
    return this;
  },

  createSession: function (event){
    event.preventDefault();
    var formData = $(event.currentTarget).serializeJSON().user;
	
    this.model.save(formData, {
      success: function(model, response, options) {
				console.log("saved!", model, response, options);
				Tumblero.current_user = new Tumblero.Models.User({ id: response.id });
				Tumblero.current_user.fetch();
//         Backbone.history.navigate("users/" + response.id, {trigger: true});
				
				window.location.replace("#/users/" + response.id);
      }.bind(this),
			
			error: function(model, response, options){
				console.log(model, response, options);
				var res = $.parseJSON(response.responseText).join(" ");
				this.$('.errors').html(res);
			}.bind(this)
    });
  }
})