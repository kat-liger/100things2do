define(

    ['jquery', 'lodash', 'parse', 'text!templates/card-template.html'],

    function($, _, Parse, CardTemplate) {

        var CardView = Parse.View.extend({
            //tagName: "article",
            //className: "card-container",
            //template: $("#cardTemplate").html(),

            render: function () {
                var tmpl = _.template( CardTemplate );

                $(this.el).html(tmpl(this.model.toJSON()));
                return this;
            }

        });
    return CardView;
    });