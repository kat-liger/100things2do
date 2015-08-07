require (
    ['jquery', 'lodash', 'json2', 'parse', 'materialize', 'views/cards-view',
        'views/signup-view','views/login-view',
        'views/manage-cards-view', 'text!templates/userinfo-template.html','text!templates/loginsignup-template.html'],

    function($, _, json2, Parse, Materialize, CardsView,
         SignupView, LoginView,
         ManageCardsView, UserinfoTemplate, LoginSignupTemplate) {

        'use strict';
        //Parse.$ = $;
        Parse.initialize("5jqnBuG8MWb2et9PNWXmTPE3gqVJeRdfVpQrf4JL", "kvJEstj10MpNCKVQUCPs2ftMZJ2x7zLhX6VLZ0GY");


        $('.modal-trigger').leanModal();

        // The main view for the app
        var AppView = Parse.View.extend({

            el: "body",
            manageCardsView: null,
            isLikeInProgress: false,

            events: {
                'click .signup-trigger': 'signUp',
                'click .login-trigger': 'login',
                'click .log-out': 'logOut',
                'click a.like': 'like',
                'click a.brand-logo': 'home'

            },

            initialize: function() {
                this.render();

                $('.button-collapse').sideNav({
                        menuWidth: 200,
                        closeOnClick: true // Closes side-nav on <a> clicks
                    }
                );

            },

            render: function() {

                if (Parse.User.current()) {
                    this.manageCardsView = new ManageCardsView;
                    this.$('.hide-on-med-and-down').html(_.template( UserinfoTemplate ));

                } else {

                    var cardsView = new CardsView();
                }
            },

            home: function() {

                    if (Parse.User.current()) {

                        this.manageCardsView.showAll();

                    }

            },

            signUp: function() {
                var signupView = new SignupView;
                var that = this;
                signupView.on("signupSuccess",function() {
                    that.render();
                });
            },

            login: function() {
                var loginView = new LoginView;
                var that = this;
                loginView.on("loginSuccess",function() {
                    that.render();
                });

            },

            like: function(e) {
                if (Parse.User.current()) {
                    e.preventDefault();
                    var cardId = $(e.target).parents(".card").attr("data-id");
                    this.updateLike(cardId);

                } else {

                   this.login();

                }
            },


            logOut: function(e) {
                Parse.User.logOut();
                this.$el.find(".filters").remove();
                this.$el.find(".fixed-action-btn").remove();
                this.$el.find("#cards").empty();
                this.$('.hide-on-med-and-down').html(_.template( LoginSignupTemplate ));
                this.render();
            },

            updateLike: function(cardId) {
                var that = this;

                if (this.isLikeInProgress === true) {
                    return;
                }

                this.isLikeInProgress = true;

                var Likes = Parse.Object.extend("Likes");
                var likes = new Likes();
                //we need to check collection for the row where cardId = cardId and userId = Parse.User.current().id
                //and only if it doesn't exist we should run the following
                var likeQuery = new Parse.Query(Likes);
                likeQuery.equalTo("cardId", cardId);
                likeQuery.equalTo("userId", Parse.User.current().id);

                likeQuery.find({
                    success: function(results) {
                        if (results.length > 0) {
                            //remove results from cloud
                            _.each(results, function(result) {
                                result.destroy();
                            });
                            that.removeLike(likes, cardId, that);
                            that.isLikeInProgress = false;
                        } else {
                            //add row to Likes
                            that.addLike(likes,cardId,that);
                            that.isLikeInProgress = false;
                        }

                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },

            addLike: function(likes, cardId, scope) {
                likes.save({
                    cardId: cardId,
                    userId: Parse.User.current().id
                    //ACL: new Parse.ACL(Parse.User.current())
                }).then(function () {
                    var thisCard = scope.manageCardsView.collection.get(cardId);
                    thisCard.increment("liked", 1);
                    thisCard.save(null, {
                        success: function(newCard) {
                            //adding this card to likedCardsCollection as well
                            scope.manageCardsView.likedCardsCollection.add(newCard);
                        }
                    });
                });
            },

            removeLike: function(likes, cardId, scope) {
                var thisCard = scope.manageCardsView.collection.get(cardId);
                thisCard.increment("liked", -1);
                thisCard.save(null, {
                    success: function (newCard) {
                        //removing this card from likedCardsCollection as well
                        scope.manageCardsView.likedCardsCollection.remove(newCard);
                    }
                });
            }

        });

        // This is the transient application state, not persisted on Parse
        var AppState = Parse.Object.extend("AppState", {
            defaults: {
                filter: "all"
            }
        });

        var state = new AppState();


        //create instance of master view
        var appView = new AppView();


        return appView;

    }
);