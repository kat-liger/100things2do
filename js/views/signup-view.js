define(

    ['jquery', 'lodash', 'parse', 'views/cards-view'],

    function($,_,Parse,CardsView) {

        var SignupView = Parse.View.extend({

            el: "#cards",

            events: {
                'click .cancel-button': 'cancel',
                'click .signup-button': 'signUp',
                'submit form.signup-form': 'signUp'
            },

            initialize: function() {
                _.bindAll(this, "signUp");
                this.render();
            },

            signUp: function(e) {
                var self = this;
                var username = this.$("#signup-username").val();
                var password = this.$("#signup-password").val();

                Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
                    success: function(user) {
                        new CardsView();
                        alert('This worked!');
                        //replace content of .hide-on-med-and-down with "<li>You are logged on as</li>"
                        self.undelegateEvents();
                        delete self;
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
                this.$el.append(_.template($("#signup-template").html()));
                this.$el.find(".modal").openModal();
                this.delegateEvents();
            },

            //function to go back to Home Page
            cancel: function() {
                this.$el.find(".modal").closeModal();
            }
        });

        return SignupView;
    });
