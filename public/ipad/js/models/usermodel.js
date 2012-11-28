window.user = window.user || {};
window.user.DAO = function (db) {
    this.db = db;
    user.userDAO = this;
       
};

_.extend(window.user.DAO.prototype, {
    
    findAll:function (callback,table) {
        this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM users ORDER BY name";
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

                var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='users';";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length;

                    if(len <= 0){
                      user.userDAO.populate();
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
                   
                tx.executeSql('DROP TABLE IF EXISTS users');
                var sql =
                    "CREATE TABLE IF NOT EXISTS users ( " +
                        "id INTEGER NOT NULL PRIMARY KEY, " +
                        "name VARCHAR(50), " +
                        "classroom_id INTEGER,"+
                        "created_at INTEGER  , " +
                        "updated_at INTEGER)" ;
                console.log('Creating WINE table');
                tx.executeSql(sql);
                console.log('Inserting wines');
                $.ajaxSetup({
                   async: false

                 });
                var rows = [];
                $.get('http://127.0.0.1:3000/users.json', function(data) {
                  $.each(data,function(i,row){
                    rows.push(row);
                  });
                  
                });
                $.each(rows,function(i,row){
                    //alert("'"+row.remote_id+"','"+row.title+"','test','"+row.created_at+"','"+row.created_at+"'");
                    tx.executeSql("INSERT INTO users VALUES ('"+row.id+"','"+row.name+"','"+row.classroom_id+"',"+row.created_at+","+row.created_at+")");
                });
                
            
                
            },

            function (tx, error) {
                console.log(error);
                alert('Transaction error ' + error.code);
            }
        );

    },

    set_up_collections:function(){
        window.users = new user.collection;
        window.users.fetch();
    }
});

window.user.model = Backbone.Model.extend({
    dao: user.DAO,    
});

window.user.collection = Backbone.QueryCollection.extend({
	model: user.model,
    dao: user.DAO,
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

