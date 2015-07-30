define(

    ['jquery', 'lodash', 'parse', 'views/cards-view','views/manage-cards-view'],

    function($,_,Parse,CardsView, ManageCardsView) {

    var ConfirmModalView = Parse.View.extend({
    el: "#confirm-modal",
    events: {
        "click .btn-ok": "runCallBack"
    },
    initialize: function(args){
        this.$el.find(".modal-body").html("<p>"+args.body+"</p>");
        this.cb = args.cb;
    },
    render: function(){
        this.$el.modal("show");
    },
    close: function(){
        this.$el.modal("close");
    },
    runCallBack: function(){
        this.cb();
    }
});


        return ConfirmModalView;
    });