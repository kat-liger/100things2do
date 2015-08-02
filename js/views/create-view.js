define(

    ['jquery', 'lodash', 'parse', 'text!templates/create-template.html'],

    function($,_,Parse,CreateTemplate) {
        "use strict";

        var CreateView = Parse.View.extend({

            //el: "#create-div",
            tagName: "div",

            events: {
                'click .cancel-button': 'cancel',
                'click .create-button': 'createCard',
                'submit form.create-form': 'createCard'
            },

            initialize: function() {

                this.render();

            },

            createCard: function() {
                var url = this.$("#image-url").val();
                var description = this.$("#create-textarea").val();

                function isUrl(s) {
                    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                    return regexp.test(s);
                }
                if (!isUrl(url)) {
                    $(".create-form .error").html("Please enter valid image URL").show();
                    return;
                    }

                description = description.substring(0,800);

                //console.log("user with name "+ Parse.User.current().get("username")+" and ACL "+Parse.User.current().id+
                //    " added card with URL "+url+" and description \""+description+"\"");
                //var acl = new Parse.ACL();
                //acl.setPublicReadWriteAccess(true);
                //acl.setPublicWriteAccess(true);
                //acl.setWriteAccess(Parse.User.current().id, true);
                var that = this;
                var Card = Parse.Object.extend("Cards");
                var card  = new Card({
                    url: url,
                    description: description,
                    author: Parse.User.current().get("username"),
                    liked: 0
                    //ACL: acl
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
                //this.$el.empty();
                //this.$el.append("<div id='create-div'></div>");
                $('body').append(this.$el);
                this.$el.append(_.template( CreateTemplate ));

                $('textarea#create-textarea').characterCounter();


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
