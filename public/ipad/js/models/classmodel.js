window.classroom = window.classroom || {};
window.classroom.DAO = function (db) {
    this.db = db;
    classroom.classDAO = this;
       
};

_.extend(window.classroom.DAO.prototype, {
    
    findAll:function (callback,table) {
        this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM classrooms ORDER BY name";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length;
                    var wines = [];
                    for (var i = 0; i < len; i++) {
                        wines[i] = results.rows.item(i);
                    }
                    callback(wines);
                });
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    },

    create:function (model, callback) {
       

    },

    update:function (model, callback) {
       
    },

    destroy:function (model, callback) {
//        TODO: Implement
    },

    find:function (model, callback) {
//        TODO: Implement
    },
    check_existence:function(callback){
        this.db.transaction(
            function (tx) {

                var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='classrooms';";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length;

                    if(len <= 0){
                      classroom.classDAO.populate();
                    }
                    
                });
            },
            function (tx, error) {
                console.log(error);
                alert('Transaction error ' + error.code);
            },
            function (tx) {
                callback();

            }
        );
    },

//  Populate Wine table with sample data
    populate:function () {
        
        this.db.transaction(
            function (tx) {
                console.log('Dropping WINE table');
                   
                tx.executeSql('DROP TABLE IF EXISTS classrooms');
                var sql =
                    "CREATE TABLE IF NOT EXISTS classrooms ( " +
                        "id INTEGER NOT NULL PRIMARY KEY, " +
                        "name VARCHAR(50), " +
                        "created_at INTEGER  , " +
                        "updated_at INTEGER)" ;
                console.log('Creating WINE table');
                tx.executeSql(sql);
                console.log('Inserting wines');
                $.ajaxSetup({
                   async: false

                 });
                var rows = [];
                $.get('http://127.0.0.1:3000/classrooms.json', function(data) {
                    console.log(data);
                  $.each(data,function(i,row){
                    rows.push(row);
                  });
                  
                });
                $.each(rows,function(i,row){
                    //alert("'"+row.remote_id+"','"+row.title+"','test','"+row.created_at+"','"+row.created_at+"'");

                    tx.executeSql("INSERT INTO classrooms VALUES ('"+row.id+"','"+row.name+"',"+row.created_at+","+row.created_at+")");
                });
                
            
                
            },

            function (tx, error) {
                console.log(error);
                alert('Transaction error ' + error.code);
            }
        );

    },

    set_up_collections:function(){
        window.classrooms = new classroom.collection;
        window.classrooms.fetch();
    }
});

window.classroom.model = Backbone.RelationalModel.extend({
	idAttribute: "remote_id",
    dao: classroom.DAO,

});

window.classroom.collection = Backbone.QueryCollection.extend({
	model: classroom.model,
	idAttribute: "remote_id",
    dao: classroom.DAO,
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

