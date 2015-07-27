define(

    ['jquery', 'lodash', 'parse', 'text!templates/card-template.html'],

    function($, _, Parse, CardTemplate) {

        var CardView = Parse.View.extend({
            //tagName: "article",
            //className: "card-container",
            //template: $("#cardTemplate").html(),

            initialize: function() {
                //this.on('change:liked', this.render);
                this.model.on("change", this.onChange, this);
            },

            render: function () {
                var tmpl = _.template( CardTemplate );

                $(this.el).html(tmpl(this.model.toJSON()));

                return this;
            },

            onChange: function() {
                this.render();
            }

        });
    return CardView;
    });