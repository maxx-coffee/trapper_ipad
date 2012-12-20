window.program = window.program || {};




window.program.model = Backbone.RelationalModel.extend({
    url:"https://tk.epiclabs.com/api/programs/89f138dd4c4021198516cd12b594f6a5"

});

window.program.collection = Backbone.QueryCollection.extend({
	model: program.model,
    url: "https://tk.epiclabs.com/api/programs/89f138dd4c4021198516cd12b594f6a5",
    initialize: function(){
      this.storage = new Offline.Storage('program', this)
    },
    
    comparator: function(model){
     if (model.get("name")) {
           var str = model.get("name");
           str = str.toLowerCase();
           str = str.split("");
           str = _.map(str, function(letter) { return String.fromCharCode((letter.charCodeAt(0))) });
           return str;
         };
    } 
    
	
    
});

window.programs = new program.collection;
window.programs.fetch();


