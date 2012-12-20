window.program.programs = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('programs'));
        _.bindAll(this, "render");
        this.model.bind("change", this.render, this);
        this.model.bind("reset", this.render, this);


        renderedview = this;
        this.element = $(this.el);
        renderedview.element.html(renderedview.template);
        this.program_template = this.element.find("#programs").html();

    },
    events:{
      'keyup #keywords': 'search',
      'click .next':'change_page',
      'click .previous':'change_page'
    },
    search:function(e, page_number){
      var target = $(e.currentTarget);
      var keywords = target.val();
      var class_id = parseInt(this.options.class_id);
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = programs.query({name: {$likeI: keywords }},{limit:9, page:page_number, pager:this.render_page});
      return collection;
    },

    render: function(e, page_number) {
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = programs.query({},{limit:9, page:page_number, pager:this.render_page});
      $("#main_nav").hide();
      return this;
    },

    render_page:function(total_pages, collection){
        var ul = $('ul', $(renderedview.el));
        renderedview.element.append(this.pagination);
        var handlebartemplate = Handlebars.compile(renderedview.program_template);
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
        renderedview.element.find("ul").html(handlebartemplate({programs: collection})); 
        
    },
    change_page:function(e){
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      renderedview.options.page = page_number;
      this.render(e,page_number, this.options.program_id);
      e.preventDefault();
    }

});

window.classroom.classrooms = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('classrooms'));
        _.bindAll(this, "render");
        this.model.bind("change", this.render, this);
        classrooms.bind("reset", this.render, this);


        renderedview = this;
        this.element = $(this.el);

    },
    events:{
      'click .next':'change_page',
      'click .previous':'change_page'
    },

    render: function(e, page_number) {
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = classrooms.query({program_group_id:renderedview.options.program_id},{limit:9, page:page_number, pager:this.render_page});
      $("#main_nav").hide();
      return this;
    },

    render_page:function(total_pages, collection){
        var ul = $('ul', $(renderedview.el));
        renderedview.element.html(renderedview.template);
        renderedview.element.append(this.pagination);

        
        var handlebartemplate = Handlebars.compile(renderedview.element.find("#prizes").html());
        apply_date(renderedview.element);
        if(renderedview.options.page > 1 && typeof renderedview.options.page != 'undefined'){
          var previous = parseInt(renderedview.options.page)-1;
          renderedview.element.find('.nav').append('<a href="#" data-page_number="'+previous+'" class="previous">Previous</a> ');
        }
        if(renderedview.options.page < total_pages && typeof renderedview.options.page != 'undefined'){
          var next = parseInt(renderedview.options.page)+1;
          renderedview.element.find('.nav').append('<a href="#" data-page_number="'+next+'" class="next">Next</a> ');
        }

        renderedview.element.find("ul").html(handlebartemplate({prizes: collection})); 
        
    },
    change_page:function(e){
      var clickedtarget = $(e.currentTarget);
      var page_number = clickedtarget.data('page_number');
      renderedview.options.page = page_number;
      this.render(e,page_number, this.options.program_id);
      e.preventDefault();
    }

});

window.classroom.prizes = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('prizes'));
        _.bindAll(this, "render");
        this.model.bind("change", this.render, this);
        this.model.bind("reset", this.render, this);
        $('#main_nav').show();
        renderedview = this;
        this.element = $(this.el);

    },
    events:{
      'click a.deliver':'flag_delivered',
      'click a.undeliver':'flag_undelivered',
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
      var collection = prizes.query({ classroom_id:271},{limit:9, page:page_number, pager:this.render_page});
      console.log(collection);
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
        this.query_collection({ classroom_id:271},this.options.page, this.options.user_id);
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


    }

    
});


