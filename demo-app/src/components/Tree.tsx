import * as React from 'react';
import { ActionTypes, Node, NodeProps, ParentData, TreeData, Checkbox, TreeProps } from '../internal';
import './Tree.css';
import { defVal } from './Helpers';

export class Tree extends React.PureComponent<TreeProps, {}> {
    /**
     * Used for default values.
     */
    public static defaultProps: TreeProps;

    /**
     * This structure contains all the data that nodes need from the
     * tree component root like settings and callback functions.
     */
    private parentData: ParentData;

    /**
     * Indicates if there is a node currently selected and which one.
     * Needed to uncheck node if user selects another.
     * Not needed when multi-select is enabled.
     */
    private selectedNode: string;

    /**
     * Generates the IDs and states for all nodes recursively.
     * The IDs are crucial for the tree to work.
     * The state is needed to avoid not defined exceptions.
     *
     * @param {NodeProps[]} tree The tree to fill the IDs up.
     * @returns {NodeProps[]} The new filled tree.
     */
    public static initTree(tree: TreeData): TreeData {
        let treeCopy = {...tree};

        for (let i in treeCopy) {
            if ( !treeCopy.hasOwnProperty(i) ) {
                continue;
            }
            if ( treeCopy[i].state == null ) {
                treeCopy[i].state = {};
            }

            treeCopy[i].state = {
                checked: defVal(treeCopy[i].state.checked, false),
                expanded: defVal(treeCopy[i].state.expanded, false),
                disabled: defVal(treeCopy[i].state.disabled, false),
                selected: defVal(treeCopy[i].state.selected, false),
            };
        }
        return treeCopy;
    }

    /**
     * Searches trough the tree or subtree in attr field for the given string.
     * Only works if the nodeSelector can be applied on the tree.
     *
     * @param {NodeProps[]} tree The tree in which the function will search.
     * @param nodeID The id of the parent node (pass null if want to search the whole tree).
     * @param attrName The name of the attribute to search in.
     * @param searchString The string to search for.
     * @return string[] Array of ID's where the string is present.
     */
    public static nodeSearch(tree: TreeData, nodeID: string, attrName: string, searchString: string): string[] {
        let findInID: string[] = [];

        let keys = Object.keys(tree);
        for (let i = 0; i < keys.length; i++) {
            let node = this.nodeSelector(tree, keys[i]);
            if ( node.attr && node.attr[attrName] && node.attr[attrName] === searchString ) {
                findInID.push(node.nodeId);
            }
        }
        return findInID;
    }

    /**
     * Searches for the node by nodeId, and returns it.
     * Search is done by walking the tree by index numbers got form the nodeId.
     *
     * @param {NodeProps[]} tree The tree which to look in the node for.
     * @param {string} nodeId The nodeId of the searched node.
     * @returns {NodeProps}
     * @bug Doesn't checks the validity of the nodeId.
     */
    public static nodeSelector(tree: TreeData, nodeId: string): NodeProps {
        return tree[nodeId];
    }

    /**
     * Updates the given node's reference in the tree.
     *
     * @param {TreeData} tree Where the node will be updated.
     * @param {NodeProps} node The node to put reference in the tree.
     * @bug Doesn't checks the validity of the node's nodeId.
     */
    public static nodeUpdater(tree: TreeData, node: NodeProps): TreeData {
        return {...tree, [node.nodeId]: node};
    }

    /**
     * Helper function: Checks the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the checked field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeChecked(node: NodeProps, value: boolean): NodeProps {
        return {...node, state: {...node.state, checked: value} };
    }

    /**
     * Helper function: Expands or collapses the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the expanded field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeExpanded(node: NodeProps, value: boolean): NodeProps {
        return {...node, state: {...node.state, expanded: value} };
    }

    /**
     * Helper function: Disables or enables the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the disabled field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeDisabled(node: NodeProps, value: boolean): NodeProps {
        return {...node, state: {...node.state, disabled: value} };
    }

    /**
     * Helper function: Selects or deselects the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the selected field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeSelected(node: NodeProps, value: boolean): NodeProps {
        return {...node, state: {...node.state, selected: value} };
    }

    /**
     * Helper function: Updates the children of the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new children of the node.
     * @returns {NodeProps} The changed node.
     */
    public static nodeChildren(node: NodeProps, value: string[]): NodeProps {
        return {...node, nodes: value};
    }

    /**
     * Helper function: Updates the loading state of the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new loading value.
     * @returns {NodeProps} The changed node.
     */
    public static nodeLoading(node: NodeProps, value: boolean): NodeProps {
        return {...node, loading: value};
    }

    /**
     * Returns all parents for the node in an array.
     *
     * @param nodeId The node id of the node for wich we need the parents.
     * @return string[] Array of node ids - the parents of the given node.
     */
    public static getAncestors(nodeId: string): string[] {
        let idArr = nodeId.split('.');
        let parents: string[] = [];

        for (let i = 1; i < idArr.length; i++) {
            let id = idArr[0];
            for (let k = 1; k < i; k++) {
                id += '.' + idArr[k];
            }
            parents.push(id);
        }
        return parents;
    }

    /**
     * Returns all descendants of the node in an array.
     *
     * @param tree The tree where the node is.
     * @param nodeId The node id to get the descendants for.
     * @return string[] Array of node ids - the descendants.
     */
    public static getDescendants(tree: TreeData, nodeId: string): string[] {
        let keys = Object.keys(tree);
        let ret: string[] = [];

        for ( let i = 0; i < keys.length; i++ ) {
            if ( keys[i].startsWith(nodeId) ) {
                ret.push(keys[i]);
            }
        }

        return ret;
    }

    /**
     * Recursively gets the max depth of the tree.
     *
     * @param {NodeProps[]} tree The root node of the tree.
     * @returns {number} The max depth of the tree.
     */
    public static getDepth(tree: TreeData): number {
        let depth = 0;
        if (tree) {
            for ( let key in tree) {
                if ( tree.hasOwnProperty(key) ) {
                    let newDepth = (key.match(/\./g) || []).length + 1;
                    if (depth < newDepth) {
                        depth = newDepth;
                    }
                }
            }
        }
        return 1 + depth;
    }

    /**
     * Generates the css classes for indenting the nodes.
     *
     * @param {number} depth Max depth of the tree. This is how many classes will be generated.
     * @returns {string} CSS: .indent-X{padding-left:X*15px}
     */
    private static generateIndentCSS(depth: number): string {
        let cssRules: string = '';
        let indentSize = 18;
        for (let i = 1; i < depth; i++) {
            cssRules += '.indent-' + i + '{padding-left:' + indentSize * i + 'px}';
        }
        return cssRules;
    }

    componentWillReceiveProps(nextProps: Readonly<TreeProps>, nextContext: any): void {
        if ( !this.props.isRedux ) {
            this.parentData = {...this.parentData, tree: nextProps.data};
        }
    }

    /**
     * Renders the tree element.
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (
            <div className="Tree">
                <ul>
                    {Node.renderSublist(this.props.data[''].nodes, this.parentData)}
                </ul>
                <style>
                    {Tree.generateIndentCSS(Tree.getDepth(this.props.data))}
                </style>
            </div>
        );
    }

    /**
     * Constructor.
     * @param {TreeProps} props
     */
    public constructor(props: TreeProps) {
        super(props);

        // Default values
        this.selectedNode = null;

        this.parentData = {
            // Non redux
            tree: this.props.data,

            // Callbacks
            checkboxOnChange: this.handleCheckboxChange,
            expandOnChange: this.handleExpandedChange,
            selectOnChange: this.handleSelectedChange,
            onLazyLoad: this.handleLazyLoad,
            showCheckbox: this.props.showCheckbox,
            initSelectedNode: this.initSelectedNode,

            // Icons
            showIcon: this.props.showIcon,
            showImage: this.props.showImage,
            nodeIcon: this.props.nodeIcon,
            checkedIcon: this.props.checkedIcon,
            uncheckedIcon: this.props.uncheckedIcon,
            partiallyCheckedIcon: this.props.partiallyCheckedIcon,
            collapseIcon: this.props.collapseIcon,
            expandIcon: this.props.expandIcon,
            loadingIcon: this.props.loadingIcon,
            errorIcon: this.props.errorIcon,
            selectedIcon: this.props.selectedIcon,

            // Styling
            changedCheckboxClass: this.props.changedCheckboxClass,
            selectedClass: this.props.selectedClass,

            // Other
            checkboxFirst: this.props.checkboxFirst,
            isRedux: this.props.isRedux,
        };
    }

    /**
     * Returns the parent's checkbox state
     * @param nodes The children of the parent node.
     * @param childCheckboxState The children from which te function is called.
     * @param changedChildrenId The id of the children what is currently changed.
     * @returns boolean Checkbox.CHECKED if should be checked, Checkbox.UNCHECKED if not,
     * Checkbox.Partially if partially checked, and undefined if the nodes is empty list.
     */
    private parentCheckboxState(nodes: string[], childCheckboxState: boolean, changedChildrenId: string): boolean {
        if ( !nodes ) {
            return undefined;
        }

        if ( childCheckboxState === Checkbox.PARTIALLY ) {
            return Checkbox.PARTIALLY;
        }

        let first: boolean = childCheckboxState;

        if ( first === Checkbox.PARTIALLY ) {
            return Checkbox.PARTIALLY;
        }

        for ( let i = 0; i < nodes.length; i++ ) {
            if ( nodes[i] === changedChildrenId ) {
                continue;
            }
            if ( first !== Tree.nodeSelector(this.props.data, nodes[i]).state.checked ) {
                return Checkbox.PARTIALLY;
            }
        }

        return first;
    }

    /**
     * Handles checkbox change if made on checkbox.
     *
     * @param {boolean} checked The checkbox new state.
     * @param {string} nodeId The element which checkbox was changed.
     */
    private handleCheckboxChange = (checked: boolean, nodeId: string): void => {
        this.props.callbacks.onDataChange(nodeId, ActionTypes.CHECKED, checked);

        if ( this.props.hierarchicalCheck ) {

            // Parent part
            let state = checked;
            let changedChildId = nodeId;
            let parents = Tree.getAncestors(nodeId);

            for (let i = parents.length - 1; i >= 0; i--) {
                let parent = Tree.nodeSelector(this.props.data, parents[i]);
                state = this.parentCheckboxState(parent.nodes, state, changedChildId);

                if ( parent.state.checked !== checked) {
                    this.props.callbacks.onDataChange(parents[i], ActionTypes.CHECKED, state);
                }
                changedChildId = parents[i];
            }

            // Children part
            if ( Tree.nodeSelector(this.props.data, nodeId).nodes.length > 0 ) {
                let descendants = Tree.getDescendants(this.props.data, nodeId);
                for ( let i = 0; i < descendants.length; i++ ) {
                    if ( Tree.nodeSelector(this.props.data, descendants[i]).state.checked !== checked) {
                        this.props.callbacks.onDataChange(descendants[i], ActionTypes.CHECKED, checked);
                    }
                }
            }
        }
    }

    /**
     * Handles the expanding and collapsing elements.
     * Passes to the callbacks.onDataChange function.
     *
     * @param {string} nodeId The nodeId of node which has changed.
     * @param {boolean} expanded The current state
     */
    private handleExpandedChange = (nodeId: string, expanded: boolean): void => {
        this.props.callbacks.onDataChange(nodeId, ActionTypes.EXPANDED, expanded);
    }

    /**
     * When constructing the node this function is called if the node is selectet.
     * If more than one node is selected and multi-select is not allowed then the first one
     * will be kept, the others will be unselected.
     *
     * @param {string} nodeId The nodeId of the currently rendering node.
     */
    private initSelectedNode = (nodeId: string): void => {
        if ( !this.props.multiSelect ) {
            if ( this.selectedNode != null ) {
                this.props.callbacks.onDataChange(nodeId, ActionTypes.SELECTED, false);
            } else {
                this.selectedNode = nodeId;
            }
        }
    }

    /**
     * If node is selected then checks if multi-select is active.
     * If not active and another node is currently selected, then deselects it.
     * Calls the callback for change the selected nodes.
     *
     * If preventDeselect is active then all deselecting actions are skipped.
     *
     * @param {string} nodeId The nodeId of the node which was selected/deselected.
     * @param {boolean} selected The new state of the node.
     */
    private handleSelectedChange = (nodeId: string, selected: boolean): void => {

        // Preventing deselect but if re-select is active then simulating select.
        if ( this.props.preventDeselect && !selected ) {
            if ( this.props.allowReselect ) {
                this.props.callbacks.onDataChange(nodeId, ActionTypes.SELECTED, true);
            }
        } else if ( !this.props.multiSelect && selected ) {

            // Deselect previous
            if ( this.selectedNode != null ) {
                this.props.callbacks.onDataChange(this.selectedNode, ActionTypes.SELECTED, false);
            }
            // Select the new
            this.props.callbacks.onDataChange(nodeId, ActionTypes.SELECTED, true);
            this.selectedNode = nodeId;

        } else {
            this.props.callbacks.onDataChange(nodeId, ActionTypes.SELECTED, selected);
            this.selectedNode = null;
        }
    }

    /**
     * Handles when node has to be loaded. This occur once for node if expanded.
     *
     * @param {string} nodeId The node nodeId which is about lazy load.
     */
    private handleLazyLoad = (nodeId: string): void => {
        let node = Tree.nodeSelector(this.props.data, nodeId);
        // if ( node == null ) { return; } Unreachable

        // If no function defined return empty and set to error
        if ( this.props.callbacks.lazyLoad == null ) {
            this.props.callbacks.onDataChange(nodeId, ActionTypes.CHILD_NODES, []);
            this.props.callbacks.onDataChange(nodeId, ActionTypes.LOADING, null);
            return;
        }

        // Add loading icon
        this.props.callbacks.onDataChange(nodeId, ActionTypes.LOADING, true);

        this.props.callbacks.lazyLoad(node).then((data: TreeData) => {
            this.props.callbacks.onDataChange(null, ActionTypes.ADD_NODES, Tree.initTree(data));
            this.props.callbacks.onDataChange(nodeId, ActionTypes.CHILD_NODES, Object.keys(data));

            // Remove loading icon
            this.props.callbacks.onDataChange(nodeId, ActionTypes.LOADING, false);
        }, () => {
            // Add error icon
            this.props.callbacks.onDataChange(nodeId, ActionTypes.LOADING, null);
        });
    }
}

/**
 * Tree default values.
 */
Tree.defaultProps = {
    data: null,

    // Checkbox
    showCheckbox: false,
    hierarchicalCheck: false,
    checkboxFirst: true,

    // Selection
    multiSelect: false,
    preventDeselect: false,
    allowReselect: false,

    // Icons
    showIcon: true,
    showImage: true,
    nodeIcon: 'fa fa-ban',
    checkedIcon: 'fa fa-check-square',
    uncheckedIcon: 'fa fa-square-o',
    partiallyCheckedIcon: 'fa fa-square',
    collapseIcon: 'fa fa-angle-down',
    expandIcon: 'fa fa-angle-right',
    loadingIcon: 'fa fa-spinner fa-spin',
    errorIcon: 'fa-exclamation-triangle',
    selectedIcon: 'fa fa-check',

    // Styling
    changedCheckboxClass: 'changed-checkbox',
    selectedClass: 'selected',

    // Other
    isRedux: false,

    // Callbacks
    callbacks: {
        onDataChange: null,
        lazyLoad: null,
    }
};
