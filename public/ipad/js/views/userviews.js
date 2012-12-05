window.user.users = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('users'));

        this.model.bind("add", this.render, this);
        this.model.bind("reset", this.render, this);

        renderedview = this;
        this.element = $(this.el);
        this.class_id = parseInt(this.options.class_id);
        renderedview.element.html(renderedview.template);
        this.user_template = this.element.find("#prizes").html();
        renderedview = this;
        

    },
    events:{
      'click .next':'next_page',
      'click .previous':'previous_page',
      'keyup #keywords': 'search',
      'click .lap_btn': 'set_lap',
      'click .increment': "add_subtract",
      'click .laps_entered':"laps_entered"
    },
    

    query_collection:function(e,page_number, class_id){
      renderedview.collection_control = "query_collection";
      var class_id = this.class_id;
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = users.query({classroom_id:class_id},{limit:10, page:page_number, pager:this.render_page});

      return collection;
    },
    

    render: function(eventName) {
        if (renderedview == this){
          renderedview.collection_control = typeof renderedview.collection_control !== 'undefined' ? renderedview.collection_control : "query_collection";
          this[renderedview.collection_control]({},this.options.page, this.options.class_id);
        }
    return this;
         
    },
    next_page:function(e){
      e.preventDefault();
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      renderedview.options.page = page_number;
      this[renderedview.collection_control](e,page_number, this.options.class_id);
      
    },
    previous_page:function(e){
      e.preventDefault();
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      renderedview.options.page = page_number;
      this[renderedview.collection_control](e,page_number, this.options.class_id);
      
    },
    render_page:function(total_pages, collection){
        var ul = $('ul', $(renderedview.el));
        
        var handlebartemplate = Handlebars.compile(renderedview.user_template);
        apply_date(renderedview.element);
        renderedview.element.find('.nav').empty();
        if(renderedview.options.page > 1 && typeof renderedview.options.page != 'undefined'){
          var previous = parseInt(renderedview.options.page)-1;
          renderedview.element.find('.nav').append('<a href="#" data-page_number="'+previous+'" class="previous">Previous</a> ');
        }
        if(renderedview.options.page < total_pages && typeof renderedview.options.page != 'undefined'){
          var next = parseInt(renderedview.options.page)+1;
          renderedview.element.find('.nav').append('<a href="#" data-page_number="'+next+'" class="next">Next</a> ');
        }
        var classroom = classrooms.get(renderedview.class_id).toJSON();
        if(classroom.laps_entered == 1){
          $(".laps_entered").hide();
        }

        
        renderedview.element.find("ul").html(handlebartemplate({prizes: collection})); 

    },
    search:function(e){
      var target = $(e.currentTarget);
      renderedview.collection_control = "query_collection";
      var keywords = target.val();
      var class_id = parseInt(this.options.class_id);
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = users.query({name: {$like: keywords },classroom_id: class_id },{limit:10, page:page_number, pager:this.render_page});
      return collection;
    },
    set_lap:function(e){
      e.preventDefault();
      var target = $(e.currentTarget);
      target.parent('div').find('input').val(target.data('laps'));
      var laps = target.parent('div').find('input');
      this.change_laps(laps, laps.val());
    },
    add_subtract:function(e){
      e.preventDefault();
      var target = $(e.currentTarget);
      var change_by = target.data('change_by');
      var laps = target.parent('div').find('input');
      if (change_by == 'increase'){
        var new_val = parseInt(laps.val())+1;
      }else if(change_by == 'decrease'){
        var new_val = parseInt(laps.val())-1;
      }

      this.change_laps(laps, new_val);

    },
    change_laps:function(input, value){
      input.val(value);
      var user = users.get(input.attr('name'));
      user.save( {laps:value, updated_at: $.now()},{
        success:function(model,response){},
        error:function(model,response){console.log(response);}
      });
      
    },
    laps_entered:function(e){
      e.preventDefault();
      var classroom = classrooms.get(this.options.class_id);
      classroom.save({laps_entered:1},{
        success:function(model, response){},
        error:function(model,respone){console.log(response)}
      });
    }
});

window.user.prizes = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('prizes'));
        _.bindAll(this, "render");
        this.model.bind("change", this.render, this);
        this.model.bind("reset", this.render, this);

        renderedview = this;
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
      if(e.which == 1){
        e.preventDefault();
      }

      renderedview.collection_control = "query_collection";
      var class_id = parseInt(class_id)
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = prizes.query({ user_id:parseInt(this.options.user_id)},{limit:9, page:page_number, pager:this.render_page});
      return collection;
      
    },
    delivered_prizes:function(e, page_number){
      if(e.which == 1){
        e.preventDefault();
      }
      renderedview.collection_control = "delivered_prizes";
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = prizes.query({delivered:1 , user_id:parseInt(this.options.user_id)},{limit:9, page:page_number, pager:this.render_page});

      return collection;

      
    },
    flag_delivered:function(e){

      var clickedtarget = $(e.currentTarget);
      var prize = prizes.get(clickedtarget.attr("id"))


      
      prize.save( {delivered:1, updated_at: $.now()},{
        success:function(model,response){},
        error:function(model,response){console.log(response);}
      });
      
      e.preventDefault();
    },
    flag_undelivered:function(e){

      var clickedtarget = $(e.currentTarget);
      var prize = prizes.get(clickedtarget.attr("id"))


      
      prize.save( {delivered:0, updated_at: $.now()},{
        success:function(model,response){},
        error:function(model,response){console.log(response);}
      });
      
      e.preventDefault();
    },

    render: function(eventName) {
      if(renderedview == this){
        renderedview.collection_control = typeof renderedview.collection_control !== 'undefined' ? renderedview.collection_control : "query_collection";
        this[renderedview.collection_control]({},this.options.page, this.options.user_id);
      }

    return this;
         
    },
    next_page:function(e){
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      renderedview.options.page = page_number;
      this[renderedview.collection_control](e,page_number, this.options.user_id);
      e.preventDefault();
    },
    previous_page:function(e){
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      renderedview.options.page = page_number;
      this[renderedview.collection_control](e,page_number, this.options.user_id);
      e.preventDefault();
    },
    render_page:function(total_pages, collection){
        var ul = $('ul', $(renderedview.el));
        renderedview.element.html(renderedview.template);
 
        apply_date(renderedview.element);
        var handlebartemplate = Handlebars.compile(renderedview.element.find("#prizes").html());
        if(renderedview.options.page > 1 && typeof renderedview.options.page != 'undefined'){
          var previous = parseInt(renderedview.options.page)-1;
          renderedview.element.find('.nav').append('<a href="#" data-page_number="'+previous+'" class="previous">Previous</a> ');
        }
        if(renderedview.options.page < total_pages && typeof renderedview.options.page != 'undefined'){
          var next = parseInt(renderedview.options.page)+1;
          renderedview.element.find('.nav').append('<a href="#" data-page_number="'+next+'" class="next">Next</a> ');
        }
        renderedview.element.find("ul").html(handlebartemplate({prizes: collection})); 

        renderedview.element.find("#header h2").html(users.get(renderedview.options.user_id).attributes.name);

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




