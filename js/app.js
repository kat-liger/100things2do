$(function() {

  Parse.$ = jQuery;

  Parse.initialize("5jqnBuG8MWb2et9PNWXmTPE3gqVJeRdfVpQrf4JL", "kvJEstj10MpNCKVQUCPs2ftMZJ2x7zLhX6VLZ0GY");

    //define product model
    var Card = Parse.Object.extend("Card",{

    });

    //define directory collection
    var Cards = Parse.Collection.extend({
        model: Card

    });

    //define individual contact view
    var CardView = Parse.View.extend({
        tagName: "article",
        //className: "card-container",
        template: $("#cardTemplate").html(),

        render: function () {
            var tmpl = _.template(this.template);
            
            $(this.el).html(tmpl(this.model.toJSON()));
            return this;
        }
    });

    //define master view
    var CardsView = Parse.View.extend({
        el: $("#cards"),

        initialize: function () {


            this.collection =  new Cards;
            this.collection.query = new Parse.Query("Cards");
            var thisView = this;
            this.collection.fetch({
                success: function() {
                    thisView.render();
                }
            });

        },

        render: function () {
            var that = this;
            var count = 0;
            _.each(this.collection.models, function (item) {

                if (count % 3 === 0) {this.$el.append("</div><div class='row isotope'>");}
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
        }
    });

    //create instance of master view
    var cardsView = new CardsView();




});