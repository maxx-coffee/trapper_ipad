window.prize = window.prize || {};

window.prize.model = Backbone.RelationalModel.extend({
	url: "/entries"
});

window.prize.collection = Backbone.QueryCollection.extend({
	model: prize.model,
	url: "/entries/",
    initialize: function(){
      this.storage = new Offline.Storage('prize', this)
    },
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});
window.prizes = new prize.collection;
window.prizes.fetch();
