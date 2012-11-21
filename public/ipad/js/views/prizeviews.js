window.WineListView = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('wine-list'));
        _.bindAll(this, "render");
        this.model.bind("change", this.render, this);
        this.model.bind("reset", this.render, this);

        prizeview = this;
        this.element = $(this.el);


    },
    events:{
      'click a.deliver':'flag_delivered',
      'click a.undeliver':'flag_undelivered',
      'click a.delivered':'delivered_prizes',
      'click a.not_delivered':'query_collection',
      'click .next':'next_page',
      'click .previous':'previous_page',
    },
    

    query_collection:function(e,page_number){
      prizeview.collection_control = "query_collection";
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = this.model.query({delivered:0},{limit:10, page:page_number, pager:this.render_page});
      return collection;
    },
    delivered_prizes:function(e, page_number){
      prizeview.collection_control = "delivered_prizes";
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = this.model.query({delivered:1},{limit:10, page:page_number, pager:this.render_page});

      return collection;
    },
    flag_delivered:function(e){

      var clickedtarget = $(e.currentTarget);
      var prize = prizes.where({remote_id:clickedtarget.attr("id")})[0];


      
      prize.save( {delivered:1, updated_at: $.now()},{
        success:function(model,response){},
        error:function(model,response){console.log(response);}
      });
      
      e.preventDefault();
    },
    flag_undelivered:function(e){

      var clickedtarget = $(e.currentTarget);
      var prize = prizes.where({remote_id:clickedtarget.attr("id")})[0];


      
      prize.save( {delivered:0, updated_at: $.now()},{
        success:function(model,response){},
        error:function(model,response){console.log(response);}
      });
      
      e.preventDefault();
    },

    render: function(eventName) {
        prizeview.collection_control = typeof prizeview.collection_control !== 'undefined' ? prizeview.collection_control : "query_collection";
        this[prizeview.collection_control]({},this.options.page);

    return this;
         
    },
    next_page:function(e){
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      prizeview.options.page = page_number;
      this[prizeview.collection_control](e,page_number);
    },
    previous_page:function(e){
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      prizeview.options.page = page_number;
      this[prizeview.collection_control](e,page_number);
    },
    render_page:function(total_pages, collection){
        var ul = $('ul', $(prizeview.el));

        prizeview.element.html(prizeview.template);
        prizeview.element.append(this.pagination);

        var handlebartemplate = Handlebars.compile(prizeview.element.find("#prizes").html());
        if(prizeview.options.page > 1 && typeof prizeview.options.page != 'undefined'){
          var previous = parseInt(prizeview.options.page)-1;
          prizeview.element.find('.nav').append('<a href="#" data-page_number="'+previous+'" class="previous">Previous</a> ');
        }
        if(prizeview.options.page < total_pages && typeof prizeview.options.page != 'undefined'){
          var next = parseInt(prizeview.options.page)+1;
          prizeview.element.find('.nav').append('<a href="#" data-page_number="'+next+'" class="next">Next</a> ');
        }
        prizeview.element.find("ul").html(handlebartemplate({prizes: collection})); 

    }

    
});

window.WineListItemView = Backbone.View.extend({

  tagName: "li",

    initialize: function() {
        var tpl = window.templateLoader;
        this.template = _.template(tpl.get('wine-list-item'));
    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.close, this);
    },

    render: function(eventName) {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
    }

});

window.WineView = Backbone.View.extend({

    initialize: function() {
        var tpl = window.templateLoader;
        this.template = _.template(tpl.get('wine-details'));
    this.model.bind("change", this.render, this);
        
    },

    render: function(eventName) {
        console.log('render');
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
    }

});

window.NewView = Backbone.View.extend({

    initialize: function(options) {
    var tpl = window.templateLoader;
    this.viewB = new prize.livetile({model:prizes});
    this.template = _.template(tpl.get('new'));

    },

    events: {
      "submit #newentryform":  "save"
    },

    render: function(eventName) {
    console.log('render');

    $(this.el).html(this.template());
    $(this.el).append(this.viewB.render().el);
   

    return this;
    },

    
    render_page:function(total_pages, collection){
      alert(total_pages)
    },

    save:function(event){
      var hash = CryptoJS.MD5(navigator.userAgent+$.now());
      this.model.create({
        name: this.$(".name").val(),
        description: "hello",
        hash: '"'+hash+'"',
        updated_at: $.now(),
        created_at: $.now()
      },{ 
        success: function(model){
          MyApp.vent.trigger("add_entry", model);
          app.navigate('', true);
        } 
      });

      event.preventDefault();
    }

});

window.EditView = Backbone.View.extend({

    initialize: function() {
    var tpl = window.templateLoader;
    this.idAttribute = 'remote_id';
    this.template = _.template(tpl.get('edit'));
    this.model.bind("reset", this.render, this);
    
    },
    
    events: {
      "submit #editentryform":  "edit"
    },

    render: function(eventName) {
    console.log('render');
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
    },

    edit:function(){

      this.model.set({
        name: this.$(".name").val(),
        description: this.model.get("description"),
        updated_at: "now",
        created_at: "now",
        update_flag: 1
      });

      this.model.save( {}, { error: this.trigger('error'), 
        success: function(){
          app.navigate('', true);
        } 
      });


      event.preventDefault();
    }

});


window.prize.livetile = Backbone.View.extend({

    initialize: function() {


    var tpl = window.templateLoader;
    this.idAttribute = 'remote_id';
    this.template = _.template(tpl.get('prize_livetile'));
    _.bindAll(this, 'render');
    this.model.bind("add", this.render, this);
    this.model.bind("reset", this.render, this);
    },

    render: function(eventName) {
    
    $(this.el).html(this.template());

    var collection = this.model;
    var collection = collection.query({},{limit:3});

    var livetile_temp = Handlebars.compile($(this.el).find("#prize_livetile").html());
    $(this.el).find("#prize_live_contain").empty().append(livetile_temp({prizes: collection}));
    return this;
    }

});