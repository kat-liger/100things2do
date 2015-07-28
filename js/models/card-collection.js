define(

    ['jquery','lodash','parse','models/card-model'],

    function($,_,Parse,Card) {

    Cards = Parse.Collection.extend({
        model: Card,

        comparator: function(card) {
            return -card.get('liked');
        }

    });

    return Cards;
    }
);