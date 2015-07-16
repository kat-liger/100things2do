require.config({

    deps: ['main'],

    baseUrl: 'js',

    paths: {
        //Libraries
        jquery: 'libs/jquery.min',
        lodash: 'libs/lodash.min',
        json2: 'libs/json2',
        //backbone: 'libs/backbone.min',
        hammerjs: 'libs/hammer.min',
        parse: 'libs/parse.min',
        materialize: 'libs/materialize.min'
    },

    shim: {
        parse: { deps: ['lodash', 'jquery'], exports: 'Parse'},
        materialize: { deps: ['jquery', 'hammerjs'] }
    }

});
