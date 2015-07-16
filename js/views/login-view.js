define(

    ['jquery', 'lodash', 'parse', 'views/cards-view'],

    function($,_,Parse,CardsView) {

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
                        new CardsView();
                        alert('You are logged in!');
                        $( "div.hide-on-med-and-down" ).html("<li>You are logged in</li>");
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
               this.$el.append(_.template($("#login-template").html()));
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

