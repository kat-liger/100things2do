define(

    ['jquery', 'lodash', 'parse', 'views/cards-view','text!templates/login-template.html'],

    function($,_,Parse,CardsView, LoginTemplate) {
        "use strict";
        var LoginView = Parse.View.extend({

            el: ".modal-container",
            isLoginInProgress: false,

            events: {
                'click .cancel-button': 'cancel',
                'click .login-button': 'logIn',
                'submit form.login-form': 'logIn',
                'keypress #login-password': 'loginOnEnter'
            },

            initialize: function() {
                _.bindAll(this, "logIn");
                this.render();
            },

            logIn: function(e) {

                if (this.isLoginInProgress === true) {
                    return;
                }

                this.isLoginInProgress = true;

                var self = this;
                var username = this.$("#login-username").val();
                var password = this.$("#login-password").val();

                Parse.User.logIn(username, password, {

                    success: function(user) {
                        self.cancel();
                        self.trigger("loginSuccess");
                        self.undelegateEvents();
                        self.isLoginInProgress = false;

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
               this.$el.html(_.template( LoginTemplate ));
               this.$el.find(".modal").openModal();
               this.delegateEvents();
            },

            //function to go back to Home Page
            cancel: function() {
                this.$el.find(".modal").closeModal();
                //this.$el.find(".modal").remove();
            },

            //function to logIn on Enter
            loginOnEnter: function(e) {
                var self = this;
                if (e.keyCode == 13) {
                    self.logIn();
                }
            }

        });

        return LoginView;
    });

