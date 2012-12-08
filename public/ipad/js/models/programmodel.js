window.program = window.program || {};




window.program.model = Backbone.RelationalModel.extend({
    url:"/programs"

});

window.program.collection = Backbone.QueryCollection.extend({
	model: program.model,
    url: "/programs",
    initialize: function(){
      this.storage = new Offline.Storage('program', this)
    },
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

window.programs = new program.collection;
window.programs.fetch();


