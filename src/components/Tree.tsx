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
    checkboxFirst?: boolean;            // < TODO: Determines if the node icon or the checkbox is the first.

    // Selection
    multiSelect?: boolean;              // < Determines if multiple nodes can be selected.
    preventUnselect?: boolean;          // < Determines if can deselect node(s).
    allowReselect?: boolean;            // < TODO Functionality?

    // Icons
    showIcon?: boolean;                 // < Determines if the icons are showed in nodes.
    showImage?: boolean;                // < Determines if images are preferred to the icons.
    nodeIcon?: string;                  // < Default icon for nodes without it.
    checkedIcon?: string;               // < The checkbox-checked icon.
    uncheckedIcon?: string;             // < The checkbox-unchecked icon.
    partiallyCheckedIcon?: string;      // < The checkbox-partially selected icon.
    collapseIcon?: string;              // < The icon for collapsing parents.
    expandIcon?: string;                // < The icon for expanding parents.
    emptyIcon?: string;                 // < TODO: The icon for empty something.
    loadingIcon?: string;               // < TODO: The loading icon when loading data with ajax.
    selectedIcon?: string;              // < The icon for selected nodes.

    // Callbacks
    /**
     * All changes made in the tree will be propagated upwards.
     * Every time the tree changes the node's data the callback will be fired.
     *
     * @param {string} id The node's id.
     * @param {string} dataType The currently changed information.
     * @param {boolean} newValue The newly assigned value.
     */
    onDataChange: (id: string, dataType: string, newValue: boolean) => void;

    // TODO: highlightChanges?: boolean;
    // TODO: highlightSearchResults?: boolean;
    // TODO: highlightSelected?: boolean;
    // TODO: lazyLoad
    // TODO: levels
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
     */
    public static initTree(tree: NodeProps[], parentID: string = '') {
        for (let i = 0; i < tree.length; i++) {
            if ( parentID === '' ) {
                tree[i].id = i.toString();
            } else {
                tree[i].id = parentID + '.' + i;
            }

            if ( tree[i].state == null ) {
                tree[i].state = {};
            }

            tree[i].state = {
                checked: defVal(tree[i].state.checked, false),
                expanded: defVal(tree[i].state.expanded, false),
                disabled: defVal(tree[i].state.disabled, false),
                selected: defVal(tree[i].state.selected, false),
            };

            if ( tree[i].nodes ) {
                Tree.initTree(tree[i].nodes, tree[i].id);
            }
        }
    }

    /**
     * Searches for the node by id, and returns it.
     * Search is done by walking the tree by index numbers got form the id.
     *
     * @param {NodeProps[]} tree The tree which to look in the node for.
     * @param {string} id The id of the searched node.
     * @returns {NodeProps}
     * @bug Doe's not checks the validity of the id.
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
            // Checkbox
            checkboxOnChange: this.handleSelectButtonChange,
            expandOnChange: this.handleExpandedChange,
            selectOnChange: this.handleSelectedChange,
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
            emptyIcon: this.props.emptyIcon,
            loadingIcon: this.props.emptyIcon,
            selectedIcon: this.props.selectedIcon,
        };
    }

    /**
     * Uses recurse to update all parent if a checkbox is changed.
     * Iterates over all children to determine the parent state.
     *
     * @param {boolean} checked The new state of the child.
     * @param {NodeProps} node The child node.
     */
    private parentSelectButtonChange(checked: boolean, node: NodeProps): void {
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

        this.parentSelectButtonChange(state, parentNode);
    }

    /**
     * Changes the sate of the node and all children recursively.
     * Calls onDataChange for each change.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     * @param {boolean} directlyChanged Defines if changed by user or just the recursive call.
     */
    private nodeSelectButtonChange(checked: boolean, node: NodeProps, directlyChanged: boolean = false): void {
        this.props.onDataChange(node.id, 'state.checked', checked);

        if ( node.nodes ) {
            if ( this.props.hierarchicalCheck ) {

                // Set checkbox state for all children nodes.
                for (let i = 0; i < node.nodes.length; i++) {
                    this.nodeSelectButtonChange(checked, node.nodes[i]);
                }
            }
        }

        if ( directlyChanged && this.props.hierarchicalCheck ) {
            this.parentSelectButtonChange(checked, node);
        }
    }

    /**
     * Handles checkbox change if made on checkbox.
     *
     * @param {boolean} checked The checkbox new state.
     * @param {string} id The element which checkbox was changed.
     */
    private handleSelectButtonChange = (checked: boolean, id: string): void => {
        let node: NodeProps = Tree.nodeSelector(this.props.data, id);
        this.nodeSelectButtonChange(checked, node, true);
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
     * If preventUnselect is active then all deselecting actions are skipped.
     *
     * @param {string} id The id of the node which was selected/deselected.
     * @param {boolean} selected The new state of the node.
     */
    private handleSelectedChange = (id: string, selected: boolean): void => {
        // Preventing unselect.
        if ( this.props.preventUnselect && !selected ) { return; }

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
}

/**
 * Tree default values.
 */
Tree.defaultProps = {
    data: [],

    // Checkbox
    showCheckbox: false,
    hierarchicalCheck: false,
    checkboxFirst: false,

    // Selection
    multiSelect: false,
    preventUnselect: false,
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
    emptyIcon: 'fa fa-fw',
    loadingIcon: 'fa fa-spinner fa-spin',
    selectedIcon: 'fa fa-check',

    // Callbacks
    onDataChange: null,
};