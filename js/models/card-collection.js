define(

    ['jquery','lodash','parse','models/card-model'],

    function($,_,Parse,Card) {

    Cards = Parse.Collection.extend({
        model: Card
    });

    return Cards;
    }
);