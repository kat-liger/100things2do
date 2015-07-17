require(
    ['jquery', 'lodash', 'json2', 'parse', 'materialize', 'views/card-view', 'views/cards-view',
        'models/card-collection', 'models/card-model','views/signup-view','views/login-view',
        'views/manage-cards-view', 'text!templates/userinfo-template.html'],
    function($, _, json2, Parse, Materialize, CardView, CardsView,
         Cards, Card, SignupView, LoginView,
         ManageCardsView, UserinfoTemplate) {

        Parse.$ = $;
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
                    new ManageCardsView;
                    this.$('.hide-on-med-and-down').html(_.template( UserinfoTemplate ));
                } else {
                    new CardsView;
                }
            },

            signUp: function() {
                 new SignupView;
            },

            login: function() {
                new LoginView;
            },

            logOut: function() {
                //ManageCardsView.logOut;
                Parse.User.logOut();
                new CardsView();
                this.undelegateEvents();
                delete this;
            },

            like: function() {
                if (Parse.User.current()) {
                    console.log("like added!");
                } else {
                   this.login();
                }
            }
        });

        //create instance of master view
        var appView = new AppView();

        return appView;

    }
);