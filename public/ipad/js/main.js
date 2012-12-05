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

            dao.update(model,options, function (data) {
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
    var userDAO = new user.DAO(self.db);
    var supportDAO = new support_request.DAO(self.db);

    userDAO.check_existence(function () {
        userDAO.set_up_collections();

    });
    classDAO.check_existence(function () {
        classDAO.set_up_collections();

    });
    supportDAO.check_existence(function () {
        supportDAO.set_up_collections();

    });

    prizeDAO.check_existence(function () {
        prizeDAO.set_up_collections();
        this.templateLoader.load(['users','prizes', 'wine-details', 'new','edit', 'prize_livetile', 'classrooms'], function () {
            self.app = new AppRouter();
            Backbone.history.start();
            var tablesync = new serversync(db);
            setInterval(function(){
                tablesync.init();
            },10000);
        });

    });



    

    
}

Handlebars.registerHelper('index_each', function(context, options) {
  var fn = options.fn, inverse = options.inverse, ctx;
  var ret = "";
 
  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ctx = Object.create(context[i]);
      ctx.index = i+1;
      ret = ret + fn(ctx);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

function apply_date(el){
  var currentTime = new Date();
  var month = currentTime.getMonth();
  var day = currentTime.getDate();
  var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
  el.find(".date").text(monthNames[month]+" "+day);
}



support_request = {
    init:function(){
      sr = this;
      this.btn = $(".support_btn");
      this.container = $("#request_form_contain");
      this.modal();
      this.create();
    },

    modal:function(){
      $("body").on("click",".support_btn", function(){
        apply_date(sr.container);
        $.colorbox({inline:true,  href:"#request_form" });
        
        return false;
      });
    }, 

    create:function(){
      $("#request_form ").submit(function(e){
        e.preventDefault();
        var student_id = $("#subject").val();
        var status = $("#status").val();
        var description = $("#description").val();

        support_requests.create({
          remote_id: CryptoJS.MD5($.now()+status+description+student_id),
          student_id: student_id,
          status: status,
          description: description,
          created_at: $.now(),
          updated_at: $.now(),
          user_id: 1
        });
      });
    }

}



reminders ={
    init:function(){
      reminder = this;
      this.btn = $(".reminders_btn");
      this.modal();
    },
    modal:function(){
      $("body").on("click",".reminders_btn", function(){
        var container = $("#reminders");
        var handlebartemplate = Handlebars.compile($("#my_request").html());
        
        $("#reminders").append(handlebartemplate({requests: support_requests.toJSON()})); 
        $.colorbox({inline:true,  href:"#reminders" });
        
        return false;
      });
    }
}