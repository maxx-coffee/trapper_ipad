window.user = window.user || {};


window.user.model = Backbone.Model.extend({
    url: "/users"    
});

window.user.collection = Backbone.QueryCollection.extend({
	model: user.model,
    url: "/users",
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

window.users = new user.collection;
window.users.fetch();

