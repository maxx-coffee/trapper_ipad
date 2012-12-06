window.classroom = window.classroom || {};




window.classroom.model = Backbone.RelationalModel.extend({
    url:"/classrooms"

});

window.classroom.collection = Backbone.QueryCollection.extend({
	model: classroom.model,
    url: "/classrooms",
    initialize: function(){
      this.storage = new Offline.Storage('classroom', this)
    },
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

window.classrooms = new classroom.collection;
window.classrooms.fetch();


