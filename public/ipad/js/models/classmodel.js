window.classroom = window.classroom || {};




window.classroom.model = Backbone.RelationalModel.extend({
    url:"https://tk.epiclabs.com/api/classrooms/89f138dd4c4021198516cd12b594f6a5"

});

window.classroom.collection = Backbone.QueryCollection.extend({
	model: classroom.model,
    url: "https://tk.epiclabs.com/api/classrooms/89f138dd4c4021198516cd12b594f6a5",
    initialize: function(){
      this.storage = new Offline.Storage('classroom', this)
    },
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

window.classrooms = new classroom.collection;
window.classrooms.fetch();


