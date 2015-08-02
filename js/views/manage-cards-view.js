define (
    ['jquery','lodash','parse','models/card-collection','views/card-view',
        'text!templates/filters-template.html', 'views/create-view'],
    function($,_,Parse,Cards,CardView,
             FiltersTemplate, CreateView) {

        "use strict";

        var ManageCardsView = Parse.View.extend({
            el: $(".section"),
            myCardsCollection: null,
            likedCardsCollection: null,
            collection: null,
            isLikedView: false,
            isAuthoredView:false,

            events: {

               "click .liked": 'showLiked',
               "click .all": 'showAll',
               "click .authored": 'showAuthored',
               "click .byAuthor": 'filterByAuthor',
               "click .create-card": 'createCard'

            },

            initialize: function () {
                // adding the tabs
                this.$el.prepend(_.template(FiltersTemplate));
                // initializing the tabs
                $(document).ready(function(){
                    $('ul.tabs').tabs();
                });

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

                this.$el.append("<div class='fixed-action-btn' style='bottom: 45px; right: 24px;'><a class='create-card btn-floating btn-large red'>"+
                    "<i class='material-icons'>add</i></a></div>");

            },

            onReady : function () {
                var that = this;

                this.likedCardsCollection.on('remove', function () {
                    if (that.isLikedView) {
                        that.showLiked();
                    }
                    if (that.isAuthoredView) {
                        that.showAuthored();
                    }
                });

                this.likedCardsCollection.on('add', function () {
                    if (that.isAuthoredView) {
                        that.showAuthored();
                    }
                });
            },

            render: function (collection) {
                //emptying container
                this.$el.find("#cards").empty();

                //adding the tabs
                //this.$el.prepend(_.template(FiltersTemplate));
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
                cardView.on("destroySuccess", function() {
                    that.showAuthored();
                });

            },

            showAll: function() {
                //emptying container
                //this.$el.find(".filters").remove();
                this.isLikedView = false;
                this.isAuthoredView = false;
                this.render(this.collection);
            },

            showLiked: function() {
                //emptying container
                //this.$el.find(".filters").remove();
                this.isLikedView = true;
                this.isAuthoredView = false;
                this.render(this.likedCardsCollection);
            },

            showAuthored: function() {
                var that = this;
                this.isAuthoredView = true;
                //emptying container
                //this.$el.find(".filters").remove();
                //create collection with cards created by this user
                that.myCardsCollection = new Cards();
                _.each(this.collection.models, function (item) {
                    if (item.get("author") === Parse.User.current().get("username")) {
                        that.myCardsCollection.add(item);
                    }
                }, this);
                this.isLikedView = false;
                this.render(that.myCardsCollection);
                if (that.myCardsCollection.length === 0) {this.$el.find("#cards").append("<div class='center no-posts'><h4>You didn't add any cards yet</h4></div>");}
                $(".remove-card").removeClass("remove-link");

            },

            createCard: function() {
                var createView = new CreateView();
                var that = this;
                createView.on("createSuccess",function(newCard) {
                    that.collection.add(newCard);

                    createView.remove();

                    that.showAuthored();
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

                        that.onReady();
                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },

            filterByAuthor: function(e) {
                e.preventDefault();
                this.isLikedView = false;
                this.isAuthoredView = false;
                var cardAuthor = $(e.target).text();
                //emptying container
                //this.$el.find(".filters").remove();
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