define(

    ['jquery', 'lodash', 'parse'],

    function($, _, Parse) {

        var CardView = Parse.View.extend({
            tagName: "article",
            //className: "card-container",
            template: $("#cardTemplate").html(),

            render: function () {
                var tmpl = _.template(this.template);

                $(this.el).html(tmpl(this.model.toJSON()));
                return this;
            }
        });
    return CardView;
    });