window.support_request = window.support_request || {};
window.support_request.DAO = function (db) {
    this.db = db;
    support_request.supportDAO = this;
       
};

_.extend(window.support_request.DAO.prototype, {
    
    findAll:function (callback,table) {
        this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM support_requests ORDER BY id";
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

    create:function (model, callback, table) {
        alert("create");
        var model_atts = model.toJSON();
        
        var keys =[];
        var values = [];
        $.each(model_atts, function(k, v) {
          
          keys.push(k);
          values.push("'"+v+"'");
        });
        console.log(keys);
        console.log(values);
        
        this.db.transaction(

            function (tx) {

                var sql = "INSERT INTO support_requests ("+keys+") VALUES ("+values+")";
                console.log(sql);
                tx.executeSql(sql, [], function (tx, results) {
                    var hash = model_atts.hash;
                    
                    model.set({id: hash});
                    callback(model.toJSON());
                });
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );


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
                tx.executeSql('UPDATE support_requests SET '+query_string+' WHERE id="'+model_atts.id+'"',[], function (tx, results) {
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

                var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='support_requests';";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length;

                    if(len <= 0){
                      support_request.classDAO.populate();
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
                   
                tx.executeSql('DROP TABLE IF EXISTS support_requests');
                var sql =
                    "CREATE TABLE IF NOT EXISTS support_requests ( " +
                        "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                        "student_id INTEGER, " +
                        "status VARCHAR(50),"+
                        "description VARCHAR,"+
                        "user_id INTEGER,"+
                        "remote_id VARCHAR,"+
                        "created_at INTEGER, " +
                        "updated_at INTEGER)" ;
                console.log('Creating WINE table');
                tx.executeSql(sql);
                console.log('Inserting wines');
                $.ajaxSetup({
                   async: false

                 });
                var rows = [];

                $.get('http://127.0.0.1:3000/supportrequests.json', function(data) {
                  
                  $.each(data,function(i,row){
                    rows.push(row);
                  });
                  
                });
                $.each(rows,function(i,row){
                    var keys =[];
                    var values = [];
                    $.each(row, function(k, v) {
                      if (k == "hash"){
                        k = "id";
                      }
                      keys.push(k);
                      values.push("'"+v+"'");
                    });


                    //alert("'"+row.remote_id+"','"+row.title+"','test','"+row.created_at+"','"+row.created_at+"'");
                    var sql = "INSERT INTO support_requests ("+keys+") VALUES ("+values+")";
                    tx.executeSql(sql);
                });
                
            
                
            },

            function (tx, error) {
                console.log(error);
                alert('Transaction error ' + error);
            }
        );

    },

    set_up_collections:function(){
        window.support_requests = new support_request.collection;
        window.support_requests.fetch();
    }
});

window.support_request.model = Backbone.RelationalModel.extend({
    dao: support_request.DAO,

});

window.support_request.collection = Backbone.QueryCollection.extend({
	model: support_request.model,
    dao: support_request.DAO,
    
    comparator: function(model){
      return -model.get("date");
    } 
    
	
    
});

