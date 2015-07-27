require(
    ['jquery', 'lodash', 'json2', 'parse', 'materialize', 'views/card-view', 'views/cards-view',
        'models/card-collection', 'models/card-model','views/signup-view','views/login-view',
        'views/manage-cards-view', 'text!templates/userinfo-template.html','text!templates/loginsignup-template.html'],
    function($, _, json2, Parse, Materialize, CardView, CardsView,
         Cards, Card, SignupView, LoginView,
         ManageCardsView, UserinfoTemplate, LoginSignupTemplate) {

        //Parse.$ = $;
        Parse.initialize("5jqnBuG8MWb2et9PNWXmTPE3gqVJeRdfVpQrf4JL", "kvJEstj10MpNCKVQUCPs2ftMZJ2x7zLhX6VLZ0GY");


        $('.modal-trigger').leanModal();

        // The main view for the app
        var AppView = Parse.View.extend({
            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: "body",
            manageCardsView: null,

            events: {
                'click .signup-trigger': 'signUp',
                'click .login-trigger': 'login',
                'click .log-out': 'logOut',
                'click a.like': 'like'
            },

            initialize: function() {
                this.render();

            },

            render: function() {

                if (Parse.User.current()) {
                    this.manageCardsView = new ManageCardsView;
                    this.$('.hide-on-med-and-down').html(_.template( UserinfoTemplate ));

                } else {

                    //this.$('.hide-on-med-and-down').html(_.template( LoginSignupTemplate ));
                    var cardsView = new CardsView;
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
                this.$el.find("#cards").empty();
                this.$('.hide-on-med-and-down').html(_.template( LoginSignupTemplate ));
                //this.undelegateEvents();
                // delete this;
                this.render();
            },

            updateLike: function(cardId) {
                var that = this;

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
                        } else {
                            //add row to Likes
                            that.addLike(likes,cardId,that);
                        }

                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },

            addLike: function(likes, cardId, scope) {

                console.log("user with ID "+Parse.User.current().id+" liked the card with ID "+cardId);
                likes.save({
                    cardId: cardId,
                    userId: Parse.User.current().id,
                    ACL: new Parse.ACL(Parse.User.current())
                }).then(function () {
                    //console.log("user with ID"+Parse.User.current().id+" liked the card with ID"+cardId);
                    //if the like was saved then increase the liked attribute of the card in Cards table
                    //var cardQuery = new Parse.Query("Cards");
                    //cardQuery.equalTo("objectId", cardId);
                    var thisCard = scope.manageCardsView.collection.get(cardId);
                    thisCard.increment("liked", 1);
                    thisCard.save();
                });
            },

            removeLike: function(likes, cardId, scope) {
                console.log("user with ID "+Parse.User.current().id+" unliked the card with ID "+cardId);
                var thisCard = scope.manageCardsView.collection.get(cardId);
                thisCard.increment("liked", -1);
                thisCard.save();
            }

        });

        // This is the transient application state, not persisted on Parse
        var AppState = Parse.Object.extend("AppState", {
            defaults: {
                filter: "all"
            }
        });

        var AppRouter = Parse.Router.extend({
            routes: {
                "": "index",
                "all": "all",
                "authored": "authored",
                "liked": "liked"
            },

            initialize: function(options) {
            },

            all: function() {
                //state.set({ filter: "all" });
                console.log("you navigated to all");
            }

/*            active: function() {
                state.set({ filter: "active" });
            },

            completed: function() {
                state.set({ filter: "completed" });
            }*/
        });

        var state = new AppState;

        new AppRouter;


        //create instance of master view
        var appView = new AppView();

        Parse.history.start({pushState: true});

        return appView;

    }
);