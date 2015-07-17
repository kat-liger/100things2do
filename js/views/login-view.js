define(

    ['jquery', 'lodash', 'parse', 'views/cards-view','views/manage-cards-view','text!templates/login-template.html'],

    function($,_,Parse,CardsView, ManageCardsView, LoginTemplate) {

        var LoginView = Parse.View.extend({

            el: "#cards",

            events: {
                'click .cancel-button': 'cancel',
                'click .login-button': 'logIn',
                'submit form.login-form': 'logIn'
            },

            initialize: function() {
                _.bindAll(this, "logIn");
                this.render();
            },

            logIn: function(e) {
                var self = this;
                var username = this.$("#login-username").val();
                var password = this.$("#login-password").val();

                Parse.User.logIn(username, password, {

                    success: function(user) {
                        self.cancel();
                        new ManageCardsView();
                        self.undelegateEvents();
                        delete self;

                    },

                    error: function(user, error) {
                        self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
                        self.$(".login-form button").removeAttr("disabled");
                    }
                });

                this.$(".login-form button").attr("disabled", "disabled");

                return false;
            },

            render: function() {
               //this.$el.append(_.template($("#login-template").html()));
               this.$el.append(_.template( LoginTemplate ));
               this.$el.find(".modal").openModal();
               this.delegateEvents();
            },

            //function to go back to Home Page
            cancel: function() {
                this.$el.find(".modal").closeModal();
            }

        });

        return LoginView;
    });

