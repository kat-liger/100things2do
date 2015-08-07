define(

    ['jquery', 'lodash', 'parse', 'text!templates/signup-template.html'],

    function($, _, Parse, SignupTemplate) {
        "use strict";
        var SignupView = Parse.View.extend({

            el: ".modal-container",
            isSignUpInProgress: false,

            events: {
                'click .cancel-button': 'cancel',
                'click .signup-button': 'signUp',
                'submit form.signup-form': 'signUp',
                'keypress #signup-password': 'signupOnEnter'
            },

            initialize: function() {
                _.bindAll(this, "signUp");
                this.render();
            },

            signUp: function(e) {

                if (this.isSignUpInProgress === true) {
                    return;
                }

                this.isSignUpInProgress = true;

                var self = this;
                var username = this.$("#signup-username").val();
                var password = this.$("#signup-password").val();

                if (username.length > 50) {
                    this.$(".signup-form .error").html("Sorry, your username is too long").show();
                    self.isSignUpInProgress = false;
                    return;
                }

                Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
                    success: function(user) {
                        self.cancel();
                        self.trigger("signupSuccess");
                        self.undelegateEvents();
                        self.isSignUpInProgress = false;
                    },

                    error: function(user, error) {
                        self.$(".signup-form .error").html(_.escape(error.message)).show();
                        self.$(".signup-form button").removeAttr("disabled");
                    }
                });

                this.$(".signup-form button").attr("disabled", "disabled");

                return false;
            },

            render: function() {
                //this.$el.append(_.template($("#signup-template").html()));
                this.$el.html(_.template( SignupTemplate ));
                this.$el.find(".modal").openModal();
                this.delegateEvents();
            },

            //function to go back to Home Page
            cancel: function() {
                this.$el.find(".modal").closeModal();
                //this.$el.find(".modal").remove();
            },

            //function to signup on Enter
            signupOnEnter: function(e) {
                var self = this;
                if (e.keyCode == 13) {
                    self.signUp();
                }
            }

        });

        return SignupView;
    });
