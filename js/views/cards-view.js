define(
    ['jquery','lodash','parse','models/card-collection','views/card-view'],
    function($,_,Parse,Cards,CardView) {

        var CardsView = Parse.View.extend({
            el: $("#cards"),

            events: {

                "click .byAuthor": 'filterByAuthor'
            },

            initialize: function () {
                //emptying container
                this.$el.find("#cards").empty();

                this.collection = new Cards;
                this.collection.query = new Parse.Query("Cards");
                var thisView = this;
                this.collection.fetch({
                    success: function (result) {
                        thisView.collection = result;
                        thisView.render(thisView.collection);
                    }
                });

            },

            render: function (collection) {

                var that = this;
                var count = 0;
                _.each(collection.models, function (item) {

                    if (count % 3 === 0) {
                        this.$el.append("</div><div class='row isotope'>");
                    }
                    that.renderCard(item);
                    this.$el.append("</div>");
                    count += 1;

                }, this);
            },

            renderCard: function (item) {
                var cardView = new CardView({
                    model: item
                });
                this.$el.append(cardView.render().el);
            },

            filterByAuthor: function(e) {
                e.preventDefault();
                var cardAuthor = $(e.target).text();
                console.log(cardAuthor);
                //create collection with cards created by this user
                var myCardsCollection = new Cards();
                _.each(this.collection.models, function (item) {
                    if (item.get("author") === cardAuthor) {
                        myCardsCollection.add(item);
                    }
                }, this);
                //emptying container
                this.$el.empty();
                this.render(myCardsCollection);
            }

        });

    return CardsView;

    });