define(
    ['jquery', 'lodash', 'parse'],
    function($, _, Parse) {

        var Card = Parse.Object.extend('Card',{
            defaults: {
                liked: 0
            }
        });

        return Card;

    }
);

