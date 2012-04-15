defineModule(function(that) {

    var trees = {};
    var TreeNode;

    that.on_moduleManager_modulesLoaded = function() {
        that.doAction('loadCss', {href:'css/koTree.css'});
    };


    that.do_renderKoTree = function(data) {
        that.require(['views/TreeView.js', 'domain/TreeNode'], function(TreeView, TN){
            TreeNode = TN;
            var treeView = TreeView(data.name);
            data.tree = trees[data.name] = Tree(treeView);
            that.doAction('renderKoTemplate', {name: 'koTree', template:'templates/tree.html', to:data.to, viewModel:treeView, origData:data});
        });
    };

    that.on_knockout_koTreeTemplateRendered = function(data) {
        that.fireEvent(data.origData.name + 'TreeRendered', data.origData);
    };

    that.jasmineSpecs = [
        'specs/TreeNodeSpec.js'
    ]


    function Tree(view) {
        var that = {};
        that.setRoot = function(node) {
            view.root(node);
        };
        that.setRootVisible = function(v) {
            view.rootVisible(v);
        };

        that.getRoot = function() {
            return view.root();
        };

        that.createNode = function(def) {
            return TreeNode(def);
        };

        return that;
    }
});