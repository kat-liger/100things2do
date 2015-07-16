define(
    ['jquery', 'lodash', 'parse'],
    function($, _, Parse) {

        var Card = Parse.Object.extend('Card',{});

        return Card;

    }
);

