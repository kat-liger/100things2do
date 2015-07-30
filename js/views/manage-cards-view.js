define(
    ['jquery','lodash','parse','models/card-collection','views/card-view',
        'views/cards-view', 'text!templates/filters-template.html', 'views/create-view'],
    function($,_,Parse,Cards,CardView,
             CardsView, FiltersTemplate, CreateView) {



        var ManageCardsView = Parse.View.extend({
            el: $(".section"),
            likedCardsCollection: null,

            events: {

               "click .liked": 'showLiked',
               "click .all": 'showAll',
               "click .authored": 'showAuthored',
               "click .byAuthor": 'filterByAuthor',
               "click .create-card": 'createCard'

            },

            initialize: function () {

                this.collection = new Cards();
                this.collection.query = new Parse.Query("Cards");
                var thisView = this;
                this.collection.fetch({
                    success: function (result) {
                        thisView.collection = result;
                        thisView.render(thisView.collection);
                        thisView.loadLikes(thisView.collection);
                    }
                });

                this.$el.append("<div class='fixed-action-btn' style='bottom: 45px; right: 24px;'><a class='create-card btn-floating btn-large red'><i class='material-icons'>add</i></a></div>");
               //this.collection.on('remove', this.render(this.collection));


            },

            render: function (collection) {
                //emptying container
                this.$el.find("#cards").empty();

                //adding the tabs
                this.$el.prepend(_.template(FiltersTemplate));
                var that = this;
                var count = 0;
                _.each(collection.models, function (item) {

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

                var that = this;
                cardView.on("destroySuccess",function() {
                    that.render();
                });
            },

            showAll: function() {
                //emptying container
                this.$el.find(".filters").remove();
                this.render(this.collection);
            },

            showLiked: function() {
                //emptying container
                this.$el.find(".filters").remove();
                this.render(this.likedCardsCollection);
            },

            showAuthored: function() {
                //emptying container
                this.$el.find(".filters").remove();
                //create collection with cards created by this user
                var myCardsCollection = new Cards();
                _.each(this.collection.models, function (item) {
                    if (item.get("author") === Parse.User.current().get("username")) {
                        myCardsCollection.add(item);
                    }
                }, this);
                this.render(myCardsCollection);
                $(".remove-card").removeClass("white-text no-cursor");

            },

            createCard: function() {
                var createView = new CreateView;
                var that = this;
                createView.on("createSuccess",function() {
                    console.log("we are inside listener function");
                    that.showAll();
                });

            },

            loadLikes: function(cardsCollection) {
                var Likes = Parse.Object.extend("Likes");
                var likes = new Likes();
                var likeQuery = new Parse.Query(Likes);

                this.likedCardsCollection = new Cards();
                var that = this;
                likeQuery.equalTo("userId", Parse.User.current().id);
                likeQuery.find({
                    success: function(results) {
                        _.each(results, function(item) {
                           var likedCard = cardsCollection.get(item.get("cardId"));
                           that.likedCardsCollection.add(likedCard);
                        });
                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },

            filterByAuthor: function(e) {
                e.preventDefault();
                var cardAuthor = $(e.target).text();
                //emptying container
                this.$el.find(".filters").remove();
                //create collection with cards created by this user
                var myCardsCollection = new Cards();
                _.each(this.collection.models, function (item) {
                    if (item.get("author") === cardAuthor) {
                        myCardsCollection.add(item);
                    }
                }, this);
                this.render(myCardsCollection);
            }

        });

        return ManageCardsView;

    });