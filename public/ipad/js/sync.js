window.serversync = function(db){
    this.db = db;
    self = this;
    this.timestamp = window.localStorage.getItem("last_sync");
    if(this.timestamp == null){
        this.reset_timestamp();
    }
    this.collections = ['prizes','users'];
              

}

serversync.prototype = {
    init:function(){
      this.check_for_updates();
      this.check_server_updates(function(){self.reset_timestamp()});
      //this.check_server_new();
       
    },
    check_for_updates:function(){
      localupdates = [];
      
      $.each(self.collections,function(k,v){
        var collection = window[v];

        var data = collection.query({
          $or:{
            updated_at:{$gt: self.timestamp}
          }
        });
        
        var entries =[];
        
        
        if(data.length > 0){
          
          
          $.each(data,function(k,v){
            entries.push(v.attributes);
          });
          localupdates[v] = entries;
        }

        
      });
      if(self.objectSize(localupdates) > 0){self.post_updates(localupdates)}
      console.log(localupdates);
      
      
    },
    post_updates:function(data){
      var obj = _.extend({}, data);
      console.log(obj);
      $.ajaxSetup({
         async: false

       });
      
      $.post("/sync", obj,
         function(data) {
           alert("Data Loaded: " + data);

      });
      
     
    },
    check_server_new:function(callback){

      $.get('http://127.0.0.1:3000/entries/added/'+self.timestamp, function(data) {

        console.log(data);
        var collection = window.prizes;
        $.each(data,function(i, row){
          row.hash = row.id;
          delete row.id;
         collection.create(row);
        });
      });
      callback();
    },
    check_server_updates:function(){
      console.log(self.timestamp);
        $.get('http://127.0.0.1:3000/entries/updated/'+self.timestamp, function(data) {
             user.userDAO.populate(function () {
                     window.users.fetch();
              });
             prize.prizeDAO.populate(function () {
                     window.prizes.fetch();
              });
             
             classroom.classDAO.populate(function () {
                 classrooms.fetch();

             });

             support_request.supportDAO.populate(function () {
                 support_requests.fetch();

             });
           
              

        });
        
        callback();
    },
    get_last_update:function(table){

    },
    reset_timestamp:function(){
      $.get('http://127.0.0.1:3000/status', function(data, response){
        window.localStorage.setItem("last_sync", $.now());
          self.timestamp = window.localStorage.getItem("last_sync");
          console.log(self.timestamp);
      });
        
    },
    errorCB:function(err) {
        console.log("Error processing SQL: "+err.code);
    },
    objectSize:function(the_object) {
      /* function to validate the existence of each key in the object to get the number of valid keys. */
      var object_size = 0;
      for (key in the_object){
        if (the_object.hasOwnProperty(key)) {
          object_size++;
        }
      }
      return object_size;
    }
}
