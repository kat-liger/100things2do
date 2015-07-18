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
                    var manageCardsView = new ManageCardsView;
                    this.$('.hide-on-med-and-down').html(_.template( UserinfoTemplate ));
                    //this.$el.find("#cards").html("<h1>Main view says that you can manage!</h1>");
                    //manageCardsView.on("logoutSuccess", this.logOut());

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

            like: function() {
                if (Parse.User.current()) {
                    console.log("like added!");
                } else {
                   this.login();
                }
            },

            logOut: function(e) {
                Parse.User.logOut();
                this.$('.hide-on-med-and-down').html(_.template( LoginSignupTemplate ));
                this.$el.find("#cards").empty();
                //this.undelegateEvents();
             //   delete this;
                this.render();
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