define(function() {
    'use strict';

    return function(that) {
        that.children = ko.observableArray(that.children || []);
        that.visible = ko.observable(that.visible !== false);
        that.expanded = ko.observable(!!that.expanded);
        that.expandable = that.expandable !== false;
        that.draggable = that.draggable === true;
        that.id = that.id || that.text;
        that.checked = ko.observable(that.checked);
        that.showCheckbox = ko.observable(that.checked() !== undefined);
        that.fetched = ko.observable(that.fetched);

        that.checked.subscribe(function(v) {
            (function loop(parent) {
                parent.children().forEach(function(child) {
                    child.checked !== undefined && child.checked(v);
                    loop(child);
                });
            }(that));
        });

        that.getSelectedNodes = function() {
            var selectedNodes = [];
            (function loop(node) {
                node.checked() && selectedNodes.push(node);
                node.children().forEach(function(child) {
                    loop(child);
                });
            }(that));
            return selectedNodes;
        };

        that.__defineGetter__('path', function() {
            return that.parent ? that.parent.path + '/' + that.id : '';
        });

        that.__defineGetter__('level', function() {
            return that.parent ? that.parent.level + 1 : 0;
        });

        that.addChild = function(node) {
            node.parent = that;
            that.children.push(node);
            node.checked(that.checked());
            return node;
        };

        that.expand = function() {
            that.expanded(!that.expanded());
            that.expanded() && that.onExpand && that.onExpand(that);
        };

        that.findNodeByPath = function(path) {
            var reg = new RegExp('^'+that.path);
            if(reg.test(path)) {
                if(that.path === path) {
                    return that;
                }
                for(var i=that.children().length;i--;) {
                    var n = that.children()[i].findNodeByPath(path);
                    if(n) {
                        return n;
                    }
                }
            }
        };

        that.handleDragStart = that.handleDragStart || function(node, ev) {
            return that.draggable;
        };
        return that;
    };

});