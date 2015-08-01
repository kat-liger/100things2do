define(

    ['jquery', 'lodash', 'parse', 'text!templates/create-template.html'],

    function($,_,Parse,CreateTemplate) {

        var CreateView = Parse.View.extend({

            el: "#create-div",

            events: {
                'click .cancel-button': 'cancel',
                'click .create-button': 'createCard',
                'submit form.create-form': 'createCard'
            },

            initialize: function() {
                //_.bindAll(this, "createCard");
                this.render();
                console.log("CreateView initialized");
            },

            createCard: function() {
                var url = this.$("#image-url").val();
                var description = this.$("#create-textarea").val();

                //console.log("user with name "+ Parse.User.current().get("username")+" and ACL "+Parse.User.current().id+
                //    " added card with URL "+url+" and description \""+description+"\"");
                var acl = new Parse.ACL();
                acl.setPublicReadAccess(true);
                acl.setWriteAccess(Parse.User.current().id, true);
                var that = this;
                var Card = Parse.Object.extend("Cards");
                var card  = new Card({
                    url: url,
                    description: description,
                    author: Parse.User.current().get("username"),
                    liked: 0,
                    ACL: acl
                });

                card.save(null, {
                    success: function(newCard) {
                        that.$el.find(".modal").closeModal();
                        that.trigger("createSuccess", newCard);
                        //console.log("user with name "+ Parse.User.current().get("username")+" and ACL "+Parse.User.current().id+
                        //   " added card with URL "+url+" and description \""+description+"\""+"and ID "+newCard.id);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });
                //this.cancel();
                return false;

            },

            render: function() {
                //this.$el.append(_.template($("#signup-template").html()));
                this.$el.empty();
                this.$el.append(_.template( CreateTemplate ));
                this.$el.find(".modal").openModal();
                this.delegateEvents();
            },

            //function to go back to Home Page
            cancel: function() {

                this.$el.find(".modal").closeModal();
                this.remove();

            }

        });

        return CreateView;
    });
