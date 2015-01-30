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
		console.log("createSession", formData);
		
    this.model.save(formData, {
      success: function(model, response, options) {
				this.$('.errors').addClass('hidden');
				Tumblero.current_user = new Tumblero.Models.User({ id: response.id });
				Tumblero.current_user.fetch();
				
        Backbone.history.navigate("/dashboard", {trigger: true});
				Tumblero.Header.refresh({ currentUser: Tumblero.current_user });

      }.bind(this),
			
			error: function(model, response, options){
				console.log(model, response, options);
				var res = $.parseJSON(response.responseText).join(" ");
				this.$('.errors').html(res).removeClass('hidden');
			}.bind(this)
    });
  }
})
