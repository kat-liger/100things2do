define(

    ['jquery', 'lodash', 'parse', 'text!templates/card-template.html', 'text!templates/confirm-removal.html'],

    function($, _, Parse, CardTemplate, ConfirmTemplate) {
        "use strict";

        var CardView = Parse.View.extend({
            //tagName: "article",
            //className: "card-container",
            //template: $("#cardTemplate").html(),
            events: {
                "click .remove-card": 'removeCard'

            },

            initialize: function() {
                //this.on('change:liked', this.render);
                this.model.on("change", this.onChange, this);
                this.model.on("destroy", this.remove, this);
            },

            render: function () {
                var tmpl = _.template( CardTemplate );

                $(this.el).html(tmpl(this.model.toJSON()));

                return this;
            },

            onChange: function() {
                this.render();
            },

            removeCard: function(e) {
                e.preventDefault();
                if (this.model.get("author") === Parse.User.current().get("username")) {
                    this.$el.append(_.template( ConfirmTemplate ));
                    this.$el.find('#confirm-modal').openModal();
                    var that = this;
                    $(".confirm-button").click(function () {
                        $('#confirm-modal').closeModal();
                        that.model.destroy();
                        that.trigger("destroySuccess");
                    });
                }

            }


        });
    return CardView;
    });