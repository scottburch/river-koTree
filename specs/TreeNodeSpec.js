describe('koTree:TreeNode', function() {

    /**
     * creates tree
     *           root
     *             |
     *             A
     *           /   \
     *         B-1  B-2
     *        /   \    \
     *      C-1  C-2   C-3
     */

    var root,a,b1,b2,c1,c2,c3, TreeNode;
    var koTreeMod = require('koTreeModule');

    // I have to manually kick knockout since jasmine blocks the event in all other modules including the knockout module
    var knockoutMod = require('knockoutModule');
    knockoutMod.require('vendor/knockout.js', function() {});

    beforeEach(function() {
        koTreeMod.require('domain/TreeNode.js', function(TN){
            TreeNode = TN;
        });
        waitsFor(function() {
            return TreeNode && window.ko;
        });
        runs(function() {
            root = TreeNode({text:'root'});

            a = root.addChild(TreeNode({text:'A'}));

            b1 = a.addChild(TreeNode({text:'B-1'}));
            c1 = b1.addChild(TreeNode({text:'C-1'}));
            c2 = b1.addChild(TreeNode({text:'C-2'}));

            b2 = a.addChild(TreeNode({text:'B-2'}));
            c3 = b2.addChild(TreeNode({text:'C-3'}));
        });
    });

    describe('TreeNode properties', function() {
        it('should have a text property', function() {
            expect(a.text).toBe('A');
        });

        describe('path', function() {
            it('should have a path property', function() {
                expect(a.path).toBe('/A');
                expect(c1.path).toBe('/A/B-1/C-1');
            });
        });

        it('should have a level property', function() {
            expect(a.level).toBe(1);
            expect(b1.level).toBe(2);
            expect(c2.level).toBe(3);
        });

        it('should have an id property set by id in config then text', function() {
            expect(TreeNode({text:'xx'}).id).toBe('xx');
            expect(TreeNode({text:'xx', id:'yy'}).id).toBe('yy');
        });
    });

    describe('findNodeByPath', function() {
        it('should return the node if you are starting with the node with that path', function() {
            expect(b1.findNodeByPath('/A/B-1')).toBe(b1);
        });

        it('should return a child node with a given path', function() {
            expect(a.findNodeByPath('/A/B-1')).toBe(b1);
        });

        it('returns undefined if not called', function() {
            expect(a.findNodeByPath('/A/B-99')).not.toBeDefined();
        });

        it('should not check paths of children on a different path', function() {
            spyOn(c3, 'findNodeByPath')
            expect(a.findNodeByPath('/A/B-1/C-1')).toBe(c1);
            expect(c3.findNodeByPath).not.toHaveBeenCalled();
        });
    });

    describe('selecting a node', function() {
        it('should select all descendants when the parent is selected', function() {
            a.checked(true);
            expect(b1.checked()).toBe(true);
            expect(c1.checked()).toBe(true);
        });

        it('should de-select all descendants when the parent is de-selected', function() {
            a.checked(true);
            a.checked(false);
            expect(b1.checked()).toBe(false);
            expect(c1.checked()).toBe(false);
        });
    });

    describe('getting selected nodes', function() {
        it('should return checked nodes', function() {
            a.checked(true);
            b2.checked(false);
            var selected = a.getSelectedNodes();
            expect(selected).toContain(a);
            expect(selected).toContain(b1);
            expect(selected).not.toContain(b2);
        });
    });




});