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

    render: function(eventName) {

      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = classrooms.query({},{limit:10, page:page_number, pager:this.render_page});

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
        console.log(collection);
        renderedview.element.find("ul").html(handlebartemplate({prizes: collection})); 
        
    }

});