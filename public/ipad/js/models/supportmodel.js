window.support_request = window.support_request || {};


window.support_request.model = Backbone.RelationalModel.extend({
  url: '/supportrequests'

});

window.support_request.collection = Backbone.QueryCollection.extend({
	model: support_request.model,
    url: '/supportrequests',
    initialize: function(){
      this.storage = new Offline.Storage('support_request', this)
    },
    comparator: function(model){
      return -model.get("date");
    } 
   
});

window.support_requests = new support_request.collection;
window.support_requests.fetch(); 


