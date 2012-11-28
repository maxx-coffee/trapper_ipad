window.classroom.classrooms = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;

        this.template = _.template(tpl.get('classrooms'));
        _.bindAll(this, "render");
        this.model.bind("change", this.render, this);
        this.model.bind("reset", this.render, this);

        classview = this;
        this.element = $(this.el);


    },

    render: function(eventName) {
      var page_number = typeof page_number !== 'undefined' ? page_number : 1;
      var collection = this.model.query({},{limit:10, page:page_number, pager:this.render_page});

      return this;
    },

    render_page:function(total_pages, collection){
        var ul = $('ul', $(classview.el));
        classview.element.html(classview.template);
        classview.element.append(this.pagination);

        
        var handlebartemplate = Handlebars.compile(classview.element.find("#prizes").html());
        if(classview.options.page > 1 && typeof classview.options.page != 'undefined'){
          var previous = parseInt(classview.options.page)-1;
          classview.element.find('.nav').append('<a href="#" data-page_number="'+previous+'" class="previous">Previous</a> ');
        }
        if(classview.options.page < total_pages && typeof classview.options.page != 'undefined'){
          var next = parseInt(classview.options.page)+1;
          classview.element.find('.nav').append('<a href="#" data-page_number="'+next+'" class="next">Next</a> ');
        }
        classview.element.find("ul").html(handlebartemplate({prizes: collection})); 
        
    }

});