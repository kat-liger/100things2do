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
        waves: 'libs/waves.min',
        materialize: 'libs/materialize.min',
        'velocity': 'libs/velocity.min',
        'jquery.hammer': 'libs/jquery.hammer'


    },

    shim: {
        parse: { deps: ['lodash', 'jquery'], exports: 'Parse'},
        materialize: { deps: ['jquery', 'hammerjs', 'jquery.hammer'] },
        'jquery.hammer': { deps: ['jquery', 'hammerjs', 'waves'] },
        'sideNav': ['jquery','velocity', 'hammerjs'],
        'waves': { exports: 'Waves' }
    }

});
