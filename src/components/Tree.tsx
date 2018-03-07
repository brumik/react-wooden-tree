import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Node, NodeProps, ParentData } from './Node';
import './Tree.css';
import { defVal } from './Helpers';

export interface TreeProps {
    data: NodeProps[];                 // < The definitions of the tree nodes.

    // Checkbox
    showCheckbox?: boolean;             // < Option: whenever the checkboxes are displayed.
    hierarchicalCheck?: boolean;        // < If enabled parent and children are reflecting each other changes.
    checkboxFirst?: boolean;            // < Determines if the node icon or the checkbox is the first.

    // Selection
    multiSelect?: boolean;              // < Determines if multiple nodes can be selected.
    preventDeselect?: boolean;          // < Determines if can be deselected all nodes.
    allowReselect?: boolean;            // < Used with preventDeselect allows to fire selected event on selected node.

    // Icons
    showIcon?: boolean;                 // < Determines if the icons are showed in nodes.
    showImage?: boolean;                // < Determines if images are preferred to the icons.
    nodeIcon?: string;                  // < Default icon for nodes without it.
    checkedIcon?: string;               // < The checkbox-checked icon.
    uncheckedIcon?: string;             // < The checkbox-unchecked icon.
    partiallyCheckedIcon?: string;      // < The checkbox-partially selected icon.
    collapseIcon?: string;              // < The icon for collapsing parents.
    expandIcon?: string;                // < The icon for expanding parents.
    loadingIcon?: string;               // < The loading icon when loading data with ajax.
    errorIcon?: string;                 // < The icon displayed when lazyLoading went wrong.
    selectedIcon?: string;              // < The icon for selected nodes.

    // Styling
    changedCheckboxClass?: string;      // < Extra class for the changed checkbox nodes.
    selectedClass?: string;             // < Extra class for the selected nodes.

    // Callbacks
    /**
     * All changes made in the tree will be propagated upwards.
     * Every time the tree changes the node's data the callback will be fired.
     *
     * @param {string} id The node's id.
     * @param {string} dataType The currently changed information.
     * @param {boolean} newValue The newly assigned value.
     */
    onDataChange: (id: string, dataType: string, newValue: any) => void;
    
    /**
     * The function which will be called when a lazily loadable node is
     * expanded first time.
     *
     * @param {NodeProps} node The node of the node which has to be loaded.
     * @returns {Promise<NodeProps[]>} Promise about the children of the given node.
     */
    lazyLoad?: (node: NodeProps) => Promise<NodeProps[]>;
}

interface TreeState {}

export class Tree extends React.Component<TreeProps, TreeState> {
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
     * The state is needed to avoid not defined expections.
     *
     * @param {NodeProps[]} tree The tree to fill the IDs up.
     * @param {string} parentID The parent id of the current nodes. For root left this param out.
     * @returns {NodeProps[]} The new filled tree.
     */
    public static initTree(tree: NodeProps[], parentID: string = ''): NodeProps[] {
        let treeCopy = tree.slice();

        for (let i = 0; i < treeCopy.length; i++) {
            if ( parentID === '' ) {
                treeCopy[i].id = i.toString();
            } else {
                treeCopy[i].id = parentID + '.' + i;
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

            if ( treeCopy[i].nodes ) {
                treeCopy[i].nodes = Tree.initTree(treeCopy[i].nodes, treeCopy[i].id);
            }
        }
        return treeCopy;
    }

    /**
     * Searches for the node by id, and returns it.
     * Search is done by walking the tree by index numbers got form the id.
     *
     * @param {NodeProps[]} tree The tree which to look in the node for.
     * @param {string} id The id of the searched node.
     * @returns {NodeProps}
     * @bug Doesn't checks the validity of the id.
     */
    public static nodeSelector(tree: NodeProps[], id: string): NodeProps {
        let path: number[] = id.split('.').map(function(nodeId: string) {
            return parseInt(nodeId, 10);
        });

        let node = tree[path[0]];
        for (let i = 1; i < path.length; i++) {
            node = node.nodes[path[i]];
        }

        return node;
    }

    /**
     * Updates the given node's reference in the tree.
     *
     * @param {NodeProps[]} tree Where the node will be updated.
     * @param {NodeProps} node The node to put reference in the tree.
     * @bug Doesn't checks the validity of the node's id.
     */
    public static nodeUpdater(tree: NodeProps[], node: NodeProps): void {
        let path: number[] = node.id.split('.').map(function(nodeId: string) {
            return parseInt(nodeId, 10);
        });

        // If top element
        if ( path.length === 1 ) {
            tree[path[0]] = node;
            return;
        }

        // Otherwise select the parent
        let tempNode = tree[path[0]];
        for (let i = 1; i < path.length - 1; i++) {
            tempNode = tempNode.nodes[path[i]];
        }

        // Update the correct child (last index in the path)
        tempNode.nodes[path[ path.length - 1 ]] = node;
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
     * @param {boolean} nodes The new children of the node.
     * @returns {NodeProps} The changed node.
     */
    public static nodeChildren(node: NodeProps, nodes: NodeProps[]): NodeProps {
        return {...node, nodes: nodes};
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
     * Recursively gets the max depth of the tree.
     *
     * @param {NodeProps[]} nodes The root node of the tree.
     * @returns {number} The max depth of the tree.
     */
    private static getDepth(nodes: NodeProps[]): number {
        let depth = 0;
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                let newDepth = Tree.getDepth(nodes[i].nodes);
                if ( depth < newDepth) {
                    depth = newDepth;
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

    /**
     * Renders the tree element.
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (
            <div className="Tree">
                <ul>
                    {Node.renderSublist(this.props.data, this.parentData)}
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
    private constructor(props: TreeProps) {
        super(props);

        this.parentData = {
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
        };
    }

    /**
     * Uses recurse to update all parent if a checkbox is changed.
     * Iterates over all children to determine the parent state.
     *
     * @param {boolean} checked The new state of the child.
     * @param {NodeProps} node The child node.
     */
    private parentCheckboxChange(checked: boolean, node: NodeProps): void {
        // Root node:
        if ( node.id.length === 1 ) { return; }

        // Others:
        const parentID: string = node.id.substring(0, node.id.length - 2);
        let parentNode: NodeProps = Tree.nodeSelector(this.props.data, parentID);

        let state = false;
        let checkedCounter = 0;
        for (let i = 0; i < parentNode.nodes.length; i++) {
            let currState = parentNode.nodes[i].state.checked;

            // If even one is partially selected then the parent will be too.
            if ( currState === undefined ) {
                state = undefined;
                break;

            // Otherwise we start to count the number of selected boxes.
            } else if ( currState === true ) {
                checkedCounter++;
            }
        }

        // If stayed unselected then was no partially selected.
        if ( state === false ) {
            if (checkedCounter === parentNode.nodes.length) {
                state = true;
            } else if (checkedCounter > 0) {
                state = undefined;
            }
        }

        if ( parentNode.state.checked !== state ) {
            this.props.onDataChange(parentNode.id, 'state.checked', state);
        }

        return this.parentCheckboxChange(state, parentNode);
    }

    /**
     * Changes the sate of the node and all children recursively.
     * Calls onDataChange for each change.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     * @param {boolean} directlyChanged Defines if changed by user or just the recursive call.
     */
    private nodeCheckboxChange(checked: boolean, node: NodeProps, directlyChanged: boolean = false): void {
        this.props.onDataChange(node.id, 'state.checked', checked);

        if ( directlyChanged && this.props.hierarchicalCheck ) {
            this.parentCheckboxChange(checked, node);
        }

        if ( node.nodes ) {
            if ( this.props.hierarchicalCheck ) {

                // Set checkbox state for all children nodes.
                for (let i = 0; i < node.nodes.length; i++) {
                    this.nodeCheckboxChange(checked, node.nodes[i]);
                }
            }
        }
    }

    /**
     * Handles checkbox change if made on checkbox.
     *
     * @param {boolean} checked The checkbox new state.
     * @param {string} id The element which checkbox was changed.
     */
    private handleCheckboxChange = (checked: boolean, id: string): void => {
        let node: NodeProps = Tree.nodeSelector(this.props.data, id);
        this.nodeCheckboxChange(checked, node, true);
    }

    /**
     * Handles the expanding and collapsing elements.
     * Passes to the onDataChange function.
     *
     * @param {string} id The id of node which has changed.
     * @param {boolean} expanded The current state
     */
    private handleExpandedChange = (id: string, expanded: boolean): void => {
        this.props.onDataChange(id, 'state.expanded', expanded);
    }

    /**
     * When constructing the node this function is called if the node is selectet.
     * If more than one node is selected and multi-select is not allowed then the first one
     * will be kept, the others will be unselected.
     *
     * @param {string} id The ID of the currently rendering node.
     */
    private initSelectedNode = (id: string): void => {
        if ( !this.props.multiSelect ) {
            if ( this.selectedNode !== null ) {
                this.props.onDataChange(id, 'state.selected', false);
            } else {
                this.selectedNode = id;
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
     * @param {string} id The id of the node which was selected/deselected.
     * @param {boolean} selected The new state of the node.
     */
    private handleSelectedChange = (id: string, selected: boolean): void => {

        // Preventing deselect but if re-select is active then simulating select.
        if ( this.props.preventDeselect && !selected ) {
            if ( this.props.allowReselect ) {
                this.props.onDataChange(this.selectedNode, 'state.selected', true);
            }

            return;
        }

        if ( !this.props.multiSelect && selected ) {

            // Deselect previous
            if ( this.selectedNode != null ) {
                this.props.onDataChange(this.selectedNode, 'state.selected', false);
            }
            // Select the new
            this.props.onDataChange(id, 'state.selected', true);
            this.selectedNode = id;

        } else {
            this.props.onDataChange(id, 'state.selected', selected);
            this.selectedNode = null;
        }
    }

    /**
     * Handles when node has to be loaded. This occur once for node if expanded.
     *
     * @param {string} id The node id which is about lazy load.
     */
    private handleLazyLoad = (id: string): void => {
        let node = Tree.nodeSelector(this.props.data, id);
        if ( node == null ) { return; }

        // Add loading icon
        this.props.onDataChange(id, 'loading', true);

        this.props.lazyLoad(node).then((data: NodeProps[]) => {
            Tree.initTree(data, id);
            this.props.onDataChange(id, 'nodes', data);

            // Remove loading icon
            this.props.onDataChange(id, 'loading', false);
        }, () => {
            // Add error icon
            this.props.onDataChange(id, 'loading', null);
        });
    }
}

/**
 * Tree default values.
 */
Tree.defaultProps = {
    data: [],

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
    nodeIcon: 'fa fa-ban fa-fw',
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

    // Callbacks
    onDataChange: null,
    lazyLoad: null,
};