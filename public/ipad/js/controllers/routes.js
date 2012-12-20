window.AppRouter = Backbone.Router.extend({

    routes:{
        "":"programs",
        "program/:program_id":"classrooms",
        "program/:program_id/classroom/:classroom_id/students":"users",
        "program/:program_id/classroom/:classroom_id":"classroom",
        "user/:user_id/prizes":"prizes",
        "wines/:remote_id":"wineDetails",
        "newentry":"newEntry",
        "editentry/:remote_id":"editEntry"
    },

    programs:function () {
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        this.before(function () {
            window.programs.storage.sync.pull();
            self.showView(new program.programs({model:programs, page:self.page}));
        });
    },

    classrooms:function (program_id, page) {
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        this.before(function () {

            window.prizes.storage.sync.pull();
            self.showView(new classroom.classrooms({model:classrooms,program_id:program_id, page:self.page}));
        });
    },
    classroom:function(program_id,classroom_id){
        alert(classroom_id);
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        this.before(function () {
            window.prizes.storage.sync.pull();

            $(".users a").attr("href","/ipad#program/"+program_id+"/classroom/"+classroom_id+"/students");
            $(".prizes a").attr("href", "/ipad#program/"+program_id+"/classroom/"+classroom_id)
            self.showView(new classroom.prizes({model:prizes,class_id:classroom_id, page:self.page}));
        });
    },

    users:function (program_id,classroom_id) {
        console.log("route: list ");
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        this.before(function () {
              window.users.storage.sync.pull();
              self.showView(new user.users({model:users, class_id:classroom_id, page:self.page}));
            
        });
    },
    prizes:function (user_id) {
        console.log("route: list ");
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        
        this.before(function () {
            console.log(prizes);
            console.log(users.get(user_id));
              self.showView(new user.prizes({model:prizes, user_id:user_id, page:self.page}));
            
        });
    },


    newEntry:function(){
        var self = this;
        this.before(function () {
            self.showView(new NewView({model:prizes}));
        });
    },
    editEntry:function(id){
        console.log('edit entry');
        var self = this;
        this.before(function () {
            var wine = prizes.where({remote_id:id})[0];
            self.showView(new EditView({model:wine}));
        });
    },

    showView:function (view) {
        console.log('showView: ' + view);
        if (this.currentView)
            this.currentView.close();
        $('body #content').html(view.render().el);
        this.currentView = view;
        return view;
    },

    before:function (callback) {
        
        callback();
        
    }

});

