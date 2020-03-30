import * as React from 'react';
import './Tree.css';
import { defVal } from './Helpers';
import {
    Checkbox,
    CommandQueueType,
    HierarchicalNodeProps,
    NodeProps,
    ParentDataType,
    TreeDataType,
    TreeProps,
    Node,
    ActionTypes
} from '..';

export const ParentDataContext = React.createContext({} as ParentDataType);

export class Tree extends React.PureComponent<TreeProps, {}> {
    /**
     * Used for default values.
     */
    public static defaultProps: TreeProps;

    /**
     * Indicates if there is a node currently selected and which one.
     * Needed to uncheck node if user selects another.
     * Not needed when multi-select is enabled.
     */
    private selectedNode: string;

    /**
     * A queue for the commands to batch them together.
     * When some operation is over the queue is sent via callback
     * and the queue is cleared.
     */
    private commandQueue: CommandQueueType[];

    /**
     * Generates the IDs and states for all nodes recursively.
     * The IDs are crucial for the tree to work.
     * The state is needed to avoid not defined exceptions.
     *
     * @param {HierarchicalNodeProps[]} tree The tree to fill the IDs up.
     * @param {string} parentID The parent nodeId of the current nodes. For root left this param out.
     * @returns {HierarchicalNodeProps[]} The new filled tree.
     */
    public static initHierarchicalTree(tree: HierarchicalNodeProps[], parentID: string = ''): HierarchicalNodeProps[] {
        let treeCopy = [...tree];

        for (let i = 0; i < treeCopy.length; i++) {
            if ( parentID === '' ) {
                treeCopy[i].nodeId = i.toString();
            } else {
                treeCopy[i].nodeId = parentID + '.' + i;
            }

            if ( !treeCopy[i].state ) {
                treeCopy[i].state = {};
            }

            treeCopy[i].state = {
                checked: defVal(treeCopy[i].state.checked, false),
                expanded: defVal(treeCopy[i].state.expanded, false),
                disabled: defVal(treeCopy[i].state.disabled, false),
                selected: defVal(treeCopy[i].state.selected, false),
            };

            if ( treeCopy[i].nodes ) {
                treeCopy[i].nodes = Tree.initHierarchicalTree(treeCopy[i].nodes, treeCopy[i].nodeId);
            }
        }
        return treeCopy;
    }

    /**
     * Converts initialized hierarchical tree to plain structure.
     *
     * @param {HierarchicalNodeProps[]} tree The initialized hierarchical tree.
     * @return {TreeDataType} The plain tree structure, consumable by redux, used in the component.
     */
    public static convertHierarchicalTree(tree: HierarchicalNodeProps[]): TreeDataType {
        let newTree: TreeDataType = {};
        let stack: HierarchicalNodeProps[] = [...tree];
        let children: string[] = [];

        // Init the root level
        for (let i = 0; i < stack.length; i++) {
            children.push(stack[i].nodeId);
        }
        newTree[''] = {nodeId: '', text: 'Root', nodes: children};

        // Non Root level
        while ( stack.length ) {
            const next: HierarchicalNodeProps = stack.pop();
            children = [];
            if ( next.nodes && next.nodes.length > 0 ) {
                for (let i = 0; i < next.nodes.length; i++ ) {
                    children.push(next.nodes[i].nodeId);
                }
                stack.push(...next.nodes);
            }
            newTree[next.nodeId] = {...next, nodes: children};
        }

        return newTree;
    }

    /**
     * Generates the IDs and states for all nodes recursively.
     * The IDs are crucial for the tree to work.
     * The state is needed to avoid not defined exceptions.
     *
     * @param {NodeProps[]} tree The tree to fill the IDs up.
     * @returns {NodeProps[]} The new filled tree.
     */
    public static initTree(tree: TreeDataType): TreeDataType {
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
    public static nodeSearch(tree: TreeDataType, nodeID: string, attrName: string, searchString: string): string[] {
        let findInID: string[] = [];

        let keys = [];
        if ( !nodeID ) {
            keys = Object.keys(tree);
        } else {
            keys = Tree.getDescendants(tree, nodeID);
        }

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
    public static nodeSelector(tree: TreeDataType, nodeId: string): NodeProps {
        return tree[nodeId];
    }

    /**
     * Updates the given node's reference in the tree.
     *
     * @param {TreeDataType} tree Where the node will be updated.
     * @param {NodeProps} node The node to put reference in the tree.
     * @bug Doesn't checks the validity of the node's nodeId.
     */
    public static nodeUpdater(tree: TreeDataType, node: NodeProps): TreeDataType {
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
     * Adds nodes to the tree, by merging the two arrays.
     *
     * @param {TreeDataType} tree The current tree.
     * @param {TreeDataType} nodes The array of the new nodes - they must be initialized (nodeId, state)
     * @return {TreeDataType} The new tree with the added nodes.
     */
    public static addNodes(tree: TreeDataType, nodes: TreeDataType): TreeDataType {
        return {...tree, ...nodes};
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
    public static getDescendants(tree: TreeDataType, nodeId: string): string[] {
        let keys = Object.keys(tree);
        let ret: string[] = [];

        for ( let i = 0; i < keys.length; i++ ) {
            if ( keys[i].startsWith(nodeId + '.') ) {
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
    public static getDepth(tree: TreeDataType): number {
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
        let indentSize = 1;
        for (let i = 0; i < depth; i++) {
            cssRules += `
            .react-tree-view .indent-${i}{padding-left:${indentSize * i}em}
            .react-tree-view .indent-${i}.no-open-button{padding-left:calc(${indentSize * i + indentSize}em + 4px)}`;
        }
        return cssRules;
    }

    /**
     * Renders the tree element.
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (
            <div className="react-tree-view">
                <ParentDataContext.Provider value={this.setParentData(this.props)}>
                    <ul>
                        {this.props.data && this.props.data[''] && this.props.data[''].nodes &&
                            Node.renderSublist(this.props.data[''].nodes, this.setParentData(this.props))}
                    </ul>
                </ParentDataContext.Provider>
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
        this.commandQueue = [];
    }

    /**
     * Creates the parentData object from the given values.
     * @param {TreeProps} props
     * @returns {ParentDataType}
     */
    private setParentData(props: TreeProps): ParentDataType {
        return {
            // Non redux
            tree: props.data ? props.data : { ['']: { nodes: []} },

            // Callbacks
            checkboxOnChange: this.handleCheckboxChange,
            expandOnChange: this.handleExpandedChange,
            selectOnChange: this.handleSelectedChange,
            onLazyLoad: this.handleLazyLoad,
            showCheckbox: props.showCheckbox,
            initSelectedNode: this.initSelectedNode,

            // Icons
            showIcon: props.showIcon,
            showImage: props.showImage,
            nodeIcon: props.nodeIcon,
            checkedIcon: props.checkedIcon,
            uncheckedIcon: props.uncheckedIcon,
            partiallyCheckedIcon: props.partiallyCheckedIcon,
            collapseIcon: props.collapseIcon,
            expandIcon: props.expandIcon,
            loadingIcon: props.loadingIcon,
            errorIcon: props.errorIcon,
            selectedIcon: props.selectedIcon,

            // Styling
            changedCheckboxClass: props.changedCheckboxClass,
            selectedClass: props.selectedClass,

            // Other
            checkboxFirst: props.checkboxFirst,
            connectedNode: props.connectedNode,
        };
    }

    /**
     * Adds the single command to the queue to send later.
     *
     * @param nodeId The id of the node to change.
     * @param type The type of change.
     * @param value The new value.
     */
    private addCommandToQueue(nodeId: string, type: string, value: any): void {
        this.commandQueue.push({nodeId: nodeId, type: this.props.actionPrefix + type, value: value});
    }

    /**
     * Sends a single command.
     *
     * @param nodeId The id of the node to change.
     * @param type The type of change.
     * @param value The new value.
     */
    private sendSignleCommand(nodeId: string, type: string, value: any): void {
        this.props.callbacks.onDataChange([{nodeId: nodeId, type: this.props.actionPrefix + type, value: value}]);
    }

    /**
     * Sends the queue and empties it.
     */
    private sendCommandQueue(): void {
        if ( this.commandQueue ) {
            this.props.callbacks.onDataChange(this.commandQueue);
            this.commandQueue = [];
        }
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
        if ( childCheckboxState === Checkbox.PARTIALLY ) {
            return Checkbox.PARTIALLY;
        }

        let first: boolean = childCheckboxState;

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
        this.addCommandToQueue(nodeId, ActionTypes.CHECKED_DIRECTLY, checked);
        this.addCommandToQueue(nodeId, ActionTypes.CHECKED, checked);

        if ( this.props.hierarchicalCheck ) {

            // Parent part
            let state = checked;
            let changedChildId = nodeId;
            let parents = Tree.getAncestors(nodeId);

            for (let i = parents.length - 1; i >= 0; i--) {
                let parent = Tree.nodeSelector(this.props.data, parents[i]);
                state = this.parentCheckboxState(parent.nodes, state, changedChildId);

                if ( parent.state.checked !== state && parent.checkable !== false ) {
                    this.addCommandToQueue(parents[i], ActionTypes.CHECKED, state);
                }
                changedChildId = parents[i];
            }

            // Children part
            if ( Tree.nodeSelector(this.props.data, nodeId).nodes ) {
                let descendants = Tree.getDescendants(this.props.data, nodeId);
                for ( let i = 0; i < descendants.length; i++ ) {
                    let node = Tree.nodeSelector(this.props.data, descendants[i]);
                    if ( node.state.checked !== checked && node.checkable !== false ) {
                        this.addCommandToQueue(descendants[i], ActionTypes.CHECKED, checked);
                    }
                }
            }
        }

        this.sendCommandQueue();
    }

    /**
     * Handles the expanding and collapsing elements.
     * Passes to the callbacks.onDataChange function.
     *
     * @param {string} nodeId The nodeId of node which has changed.
     * @param {boolean} expanded The current state
     */
    private handleExpandedChange = (nodeId: string, expanded: boolean): void => {
        this.sendSignleCommand(nodeId, ActionTypes.EXPANDED, expanded);
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
                this.sendSignleCommand(nodeId, ActionTypes.SELECTED, false);
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
                this.addCommandToQueue(nodeId, ActionTypes.SELECTED, true);
            }
        } else if ( !this.props.multiSelect && selected ) {

            // Deselect previous
            if ( this.selectedNode != null ) {
                this.addCommandToQueue(this.selectedNode, ActionTypes.SELECTED, false);
            }
            // Select the new
            this.addCommandToQueue(nodeId, ActionTypes.SELECTED, true);
            this.selectedNode = nodeId;

        } else {
            this.addCommandToQueue(nodeId, ActionTypes.SELECTED, selected);
            this.selectedNode = null;
        }

        this.sendCommandQueue();
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
            this.addCommandToQueue(nodeId, ActionTypes.CHILD_NODES, []);
            this.addCommandToQueue(nodeId, ActionTypes.LOADING, null);
            this.sendCommandQueue();
            return;
        }

        // Add loading icon and expanded
        this.sendSignleCommand(nodeId, ActionTypes.LOADING, true);

        this.props.callbacks.lazyLoad(node).then((data: TreeDataType) => {
            this.addCommandToQueue(null, ActionTypes.ADD_NODES, data);
            this.addCommandToQueue(nodeId, ActionTypes.CHILD_NODES, Object.keys(data));

            // Remove loading icon
            this.addCommandToQueue(nodeId, ActionTypes.LOADING, false);
            this.addCommandToQueue(nodeId, ActionTypes.EXPANDED, true);
            this.sendCommandQueue();
        }, () => {
            // Add error icon
            this.sendSignleCommand(nodeId, ActionTypes.LOADING, null);
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
    errorIcon: 'fa fa-fw fa-exclamation',
    selectedIcon: 'fa fa-check',

    // Styling
    changedCheckboxClass: 'changed-checkbox',
    selectedClass: 'selected',

    // Other
    connectedNode: undefined,
    actionPrefix: '',

    // Callbacks
    callbacks: {
        onDataChange: null,
        lazyLoad: null,
    }
};
