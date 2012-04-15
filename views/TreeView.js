define(function() {
    'use strict';
    return function() {
        var that = {
            root: ko.observable(),
            rootVisible: ko.observable(false)
        };
        return that;
    };

});