define(

    ['jquery', 'lodash', 'parse', 'views/cards-view','text!templates/create-template.html', 'models/card-collection'],

    function($,_,Parse,CardsView, CreateTemplate, Cards) {

        var CreateView = Parse.View.extend({

            el: "#cards",

            events: {
                'click .cancel-button': 'cancel',
                'click .create-button': 'createCard',
                'submit form.create-form': 'createCard'
            },

            initialize: function() {
                //_.bindAll(this, "createCard");
                this.render();
            },

            createCard: function(e) {
                var url = this.$("#image-url").val();
                var description = this.$("#create-textarea").val();

                //console.log("user with name "+ Parse.User.current().get("username")+" and ACL "+Parse.User.current().id+
                //    " added card with URL "+url+" and description \""+description+"\"");
                var acl = new Parse.ACL();
                acl.setPublicReadAccess(true);
                acl.setWriteAccess(Parse.User.current().id, true);

                var Collection = Parse.Object.extend("Cards");
                var collection = new Collection();
                collection.save({
                    url: url,
                    description: description,
                    author: Parse.User.current().get("username"),
                    liked: 0,
                    ACL: acl
                }, {
                    success: function(collection) {
                        // The object was saved successfully.
                    },
                    error: function(collection, error) {
                        console.log(error);
                    }
                });
                this.cancel();
                this.trigger("createSuccess");
                return false;

            },

            render: function() {
                //this.$el.append(_.template($("#signup-template").html()));
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
