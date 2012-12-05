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
        alert("create");
        callback(model.toJSON());
    },

    update:function (model,options, callback) {
        alert("update");
        console.log(options);
        var model_atts = model.toJSON();
        var model_json = JSON.stringify(model_atts);
        
        var query_string =[];
        if (options.changes){
          $.each(options.changes, function(k, v) {
              query_string.push( k+'='+model_atts[k])
          });
        }else{
          $.each(model_atts, function(k, v) {
              query_string.push( k+'="'+v+'"')
          });
        }
        console.log(query_string);


        
        this.db.transaction(
            function (tx) {
                tx.executeSql('UPDATE users SET '+query_string+' WHERE id="'+model_atts.id+'"',[], function (tx, results) {
                    callback(model.toJSON());
                });
                
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );


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
    populate:function (callback) {
        
        this.db.transaction(
            function (tx) {
                console.log('Dropping user table');
                   
                tx.executeSql('DROP TABLE IF EXISTS users');
                var sql =
                    "CREATE TABLE IF NOT EXISTS users ( " +
                        "id INTEGER NOT NULL PRIMARY KEY, " +
                        "name VARCHAR(50), " +
                        "classroom_id INTEGER,"+
                        "laps INTEGER,"+
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
                    tx.executeSql("INSERT INTO users VALUES ('"+row.id+"','"+row.name+"','"+row.classroom_id+"','"+row.laps+"',"+row.created_at+","+row.created_at+")");
                });
                
                callback();
                
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

