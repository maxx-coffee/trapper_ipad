// Asynchronous template loader
MyApp = {};
MyApp.vent = _.extend({}, Backbone.Events);
window.templateLoader = {

    // Map of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. A build script should concatenate
    // all the template files in a single file.
    load:function (names, callback) {

        var self = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('loading template: ' + name);
            $.get('ipad/tpl/' + name + '.html', function (data) {
                self.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            }, 'text');
        };

        loadTemplate(0);
    },

    // Get template by name from map of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

};



Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

Backbone.sync = function (method, model, options) {

    var dao = new model.dao(window.db);
    var table = window.table;

    switch (method) {
        case "read":
            if (model.id)
                dao.find(model, function (data) {
                    options.success(data);
                });
            else
                dao.findAll(function (data) {
                    options.success(data);
                });
            break;
        case "create":
            dao.create(model, function (data) {
                options.success(data);
            });
            break;
        case "update":
            dao.update(model, function (data) {
                options.success(data);
            });
            break;
        case "delete":
            dao.destroy(model, function (data) {
                options.success(data);
            });
            break;
    }

};

window.startApp = function () {
    var self = this;
    console.log('open database');
    window.db = window.openDatabase("funrun", "1.0", "funrun local db", 200000);

    var prizeDAO = new prize.DAO(self.db,window.table);
    var classDAO = new classroom.DAO(self.db);
    

    classDAO.populate(function () {
        classDAO.set_up_collections();

    });

    prizeDAO.populate(function () {
        prizeDAO.set_up_collections();
        this.templateLoader.load(['wine-list', 'wine-details', 'new','edit', 'prize_livetile', 'classrooms'], function () {
            self.app = new AppRouter();
            Backbone.history.start();
            var tablesync = new serversync(db);
            setInterval(function(){
                tablesync.init();
            },10000);
        });

    });



    

    
}