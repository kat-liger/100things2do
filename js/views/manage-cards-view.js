define(
    ['jquery','lodash','parse','models/card-collection','views/card-view',
        'views/cards-view', 'text!templates/filters-template.html'],
    function($,_,Parse,Cards,CardView,
             CardsView, FiltersTemplate) {

        var ManageCardsView = Parse.View.extend({
            el: $(".section"),

            events: {
               // 'click .log-out': 'logOut'
            },

            initialize: function () {

                this.collection = new Cards;
                this.collection.query = new Parse.Query("Cards");
                var thisView = this;
                this.collection.fetch({
                    success: function () {
                        thisView.render();
                    }
                });

            },

            render: function () {
                //emptying container
                this.$el.find("#cards").empty();
                //this.$el.find(".section").html("<h1>Now you can manage!</h1>");
                console.log("Now we are in manage view");


                //adding the tabs
                this.$el.find(".section").append(_.template(FiltersTemplate));
                var that = this;
                var count = 0;
                _.each(this.collection.models, function (item) {

                    if (count % 3 === 0) {
                        this.$el.find("#cards").append("</div><div class='row isotope'>");
                    }
                    that.renderCard(item);
                    this.$el.find("#cards").append("</div>");
                    count += 1;

                }, this);



            },

            renderCard: function (item) {
                var cardView = new CardView({
                    model: item
                });
                this.$el.find("#cards").append(cardView.render().el);
            }

           // logOut: function(e) {
                //Parse.User.logOut();
                //this.trigger("logoutSuccess");
                //this.undelegateEvents();
                //delete this;
                //new CardsView();
          //  }


        });

        return ManageCardsView;

    });