window.AppRouter = Backbone.Router.extend({

    routes:{
        "":"classrooms",
        "classrooms":"classrooms",
        "prizes/class/:remote_id":"users",
        "user/:user_id/prizes":"prizes",
        "wines/:remote_id":"wineDetails",
        "newentry":"newEntry",
        "editentry/:remote_id":"editEntry"
    },

    classrooms:function (page) {
        console.log("route: list ");
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        this.before(function () {
            self.showView(new classroom.classrooms({model:classrooms, page:self.page}));
        });
    },

    users:function (remote_id,page) {
        console.log("route: list ");
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        
        this.before(function () {
              self.showView(new user.users({model:users, class_id:remote_id, page:self.page}));
            
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
        $('body').html(view.render().el);
        this.currentView = view;
        return view;
    },

    before:function (callback) {
        
        callback();
        
    }

});

