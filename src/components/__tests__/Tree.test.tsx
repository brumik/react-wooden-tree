import { Tree } from '../Tree';
import { NodeProps } from '../Node';

let tree: NodeProps[];
let subTree: NodeProps[];
const initState = {
    checked: false,
    selected: false,
    disabled: false,
    expanded: false
};

beforeEach(() => {
    tree = [
        {text: 'Parent 0',
            nodes: [
                {text: 'Child 0.0'},
                {text: 'Child 0.1',
                    nodes: [
                        {text: 'Child 0.1.0'}
                    ]},
                {text: 'Child 0.2'}
            ]},
        {text: 'Parent 1', state: {selected: true}}
    ];

    subTree = [
        {text: 'Sub Parent 0'},
        {text: 'Sub Parent 1',
            nodes: [
                {text: 'Sub Child 1.0'},
                {text: 'Sub Child 1.1'}
            ]},
        {text: 'Sub Parent 2',
            nodes: [
                {text: 'Sub Child 2.0', state: {checked: true}}
            ]},
    ];

    tree = Tree.initTree(tree);
});

describe('tree public method', () => {
    it('should initialize the ids and state correctly', () => {
        expect(tree).not.toBeNull();

        expect(tree[0].nodes[1].nodes[0].id).toBe('0.1.0');
        expect(tree[0].nodes[1].nodes[0].state).toMatchObject(initState);

        expect(tree[0].nodes[0].id).toBe('0.0');
        expect(tree[0].nodes[0].state).toMatchObject(initState);

        expect(tree[1].id).toBe('1');
        expect(tree[1].state).toMatchObject({...initState, selected: true});
    });

    it('should return the correct node', () => {
        let node = Tree.nodeSelector(tree, '0.2');
        expect(node.text).toBe('Child 0.2');

        node = Tree.nodeSelector(tree, '1');
        expect(node.text).toBe('Parent 1');
    });

    it('should update the tree correctly', () => {
        let node = Tree.nodeSelector(tree, '1');

        node.text = 'Edited Node';
        Tree.nodeUpdater(tree, node);
        expect(tree[1].text).toBe('Edited Node');

        node = Tree.nodeSelector(tree, '0.1.0');
        node.text = 'Edited Child Node';
        expect(tree[0].nodes[1].nodes[0].text).toBe('Edited Child Node');
    });

    it('should return node with changed checked state', () => {
        let node = Tree.nodeSelector(tree, '1');

        node = Tree.nodeChecked(node, true);
        expect(node.state).toMatchObject({
            checked: true,
            expanded: false,
            disabled: false,
            selected: true
        });

        node = Tree.nodeChecked(node, false);
        expect(node.state).toMatchObject({
            checked: false,
            expanded: false,
            disabled: false,
            selected: true
        });
    });

    it('should return node with changed expanded state', () => {
        let node = Tree.nodeSelector(tree, '1');

        node = Tree.nodeExpanded(node, true);
        expect(node.state).toMatchObject({
            expanded: true,
            disabled: false,
            selected: true,
            checked: false
        });

        node = Tree.nodeExpanded(node, false);
        expect(node.state).toMatchObject({
            expanded: false,
            disabled: false,
            selected: true,
            checked: false
        })
    });

    it('should return node with changed disabled state', () => {
        let node = Tree.nodeSelector(tree, '1');

        node = Tree.nodeDisabled(node, true);
        expect(node.state).toMatchObject({
            expanded: false,
            disabled: true,
            selected: true,
            checked: false
        });

        node = Tree.nodeDisabled(node, false);
        expect(node.state).toMatchObject({
            expanded: false,
            disabled: false,
            selected: true,
            checked: false
        })
    });

    it('should return node with changed selected state', () => {
        let node = Tree.nodeSelector(tree, '1');

        node = Tree.nodeSelected(node, false);
        expect(node.state).toMatchObject({
            expanded: false,
            disabled: false,
            selected: false,
            checked: false
        });

        node = Tree.nodeSelected(node, true);
        expect(node.state).toMatchObject({
            expanded: false,
            disabled: false,
            selected: true,
            checked: false
        })
    });

    it('should return node with changed children nodes', () => {
        let node = Tree.nodeSelector(tree, '1');

        subTree = Tree.initTree(subTree, node.id);
        node = Tree.nodeChildren(node, subTree);

        expect(node.nodes).not.toBeNull();
        expect(node.nodes[1].nodes[0]).toMatchObject({
            text: 'Sub Child 1.0', id: '1.1.0', state: initState
        });

        expect(node.nodes[2].nodes[0]).toMatchObject({
            text: 'Sub Child 2.0', id: '1.2.0', state: {...initState, checked: true}
        });
    });

    it('should return node with changed loading state', () => {
        let node = Tree.nodeSelector(tree, '1');

        node = Tree.nodeLoading(node, true);
        expect(node.loading).toBeTruthy();

        node = Tree.nodeLoading(node, false);
        expect(node.loading).toBeFalsy();
    });
});