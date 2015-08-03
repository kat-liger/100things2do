require.config({

    deps: ['main'],

    baseUrl: 'js',

    paths: {
        //Libraries
        jquery: 'libs/jquery.min',
        lodash: 'libs/lodash.min',
        parse: 'libs/parse.min',
        json2: 'libs/json2',
        text: 'libs/text',
        hammerjs: 'libs/hammer.min',
        'jquery.hammer': 'jquery.hammer',
        waves: 'waves.min',
        materialize: 'libs/materialize.min'

    },

    shim: {
        parse: { deps: ['lodash', 'jquery'], exports: 'Parse'},
        materialize: { deps: ['jquery', 'hammerjs'] },
        'jquery.hammer': { deps: ['jquery', 'hammerjs', 'waves'] }
    }

});
