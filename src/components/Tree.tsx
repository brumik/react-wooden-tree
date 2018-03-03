import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Node, NodeProps, ParentData } from './Node';
import './Tree.css';
import { defVal } from './Helpers';

export interface TreeProps {
    data: NodeProps[];                  // < The definitions of the tree nodes.
    dataUrl?: string;                   // < TODO: An URL which returns the data in JSON.

    // Checkbox
    showCheckbox?: boolean;             // < Option: whenever the checkboxes are displayed.
    hierarchicalCheck?: boolean;        // < If enabled parent and children are reflecting each other changes.
    propagateCheckEvent?: boolean;      // < TODO: Not implemented the functionality yet.
    checkboxFirst?: boolean;            // < TODO: Determines if the node icon or the checkbox is the first.

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
    selectedIcon?: string;              // < TODO: The icon for selected nodes.

    // Callbacks
    /**
     * All changes made in the tree will be propagated upwards.
     * Every time the tree changes the node's data the callback will be fired.
     *
     * @param {string} id The node's id.
     * @param {string} dataType The currently changed information.
     * @param {boolean} newValue The newly assigned value.
     */
    onDataChange?: (id: string, dataType: string, newValue: boolean) => void;

    // TODO All of these <-- Should go into an external css file
    // backColor?: string;
    // borderColor?: string;
    // changedNodeColor?: string;
    // color?: string;
    // onHoverColor?: string;
    // searchResultColor?: string;
    // searchResultBackColor?: string;
    // selectedColor?: string;
    // selectedBackColor?: string;

    // TODO: highlightChanges?: boolean;
    // TODO: highlightSearchResults?: boolean;
    // TODO: highlightSelected?: boolean;
    // TODO: multiSelect?: boolean;
    // TODO: levels
    // TODO: lazyLoad
    // TODO: preventUnselect
    // TODO: AllowReselect
}

interface TreeState {
    nodes: NodeProps[];                 // < Contains the whole tree -> Nodes gets their data as props.
}

export class Tree extends React.Component<TreeProps, TreeState> {
    /**
     * This variable contains the tree data.
     * All changes done to tree first should change in this variable
     * then call setState to synchronize it with the state variable.
     */
    private treeNodes: NodeProps[];

    /**
     * This structure contains all the data that nodes need from the
     * tree component root like settings and callback functions.
     */
    private parentData: ParentData;

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
                    {Node.renderSublist(this.state.nodes)}
                </ul>
                <style>
                    {Tree.generateIndentCSS(Tree.getDepth(this.treeNodes))}
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
            showCheckbox: this.props.showCheckbox,

            // Icons
            showIcon: defVal(this.props.showIcon, true),
            showImage: defVal(this.props.showImage, true),
            nodeIcon: defVal(this.props.nodeIcon, 'fa fa-ban fa-fw'),
            checkedIcon: defVal(this.props.checkedIcon, 'fa fa-check-square'),
            uncheckedIcon: defVal(this.props.uncheckedIcon, 'fa fa-square-o'),
            partiallyCheckedIcon: defVal(this.props.partiallyCheckedIcon, 'fa fa-square'),
            collapseIcon: defVal(this.props.collapseIcon, 'fa fa-angle-down'),
            expandIcon: defVal(this.props.expandIcon, 'fa fa-angle-right'),
            emptyIcon: defVal(this.props.emptyIcon, 'fa fa-fw'),
            loadingIcon: defVal(this.props.emptyIcon, 'fa fa-spinner fa-spin'),
            selectedIcon: defVal(this.props.selectedIcon, 'fa fa-stop')
        };

        this.treeNodes = this.props.data;
        Node.ChildrenFactory(this.treeNodes, '', this.parentData);

        this.state = {
            nodes: this.treeNodes,
        };
    }

    /**
     * Updates the data state from the class variable.
     */
    private update() {
        this.setState({nodes: this.treeNodes});
    }

    /**
     * Initializes the given node's children if were not already initialized.
     *
     * @param {NodeProps} node The not to initialize the children.
     */
    private initNode(node: NodeProps): void {
        if ( !node.initialized ) {
            Node.ChildrenFactory(node.nodes, node.id, this.parentData);
            node.initialized = true;
        }
    }

    /**
     * Searches for the node by id, and returns it.
     * Search is done by walking the tree by index numbers got form the id.
     *
     * @param {string} id
     * @returns {NodeProps}
     * @bug Doe's not checks the validity of the id.
     */
    private nodeSelector(id: string): NodeProps {
        let path: number[] = id.split('.').map(function(nodeId: string) {
            return parseInt(nodeId, 10);
        });

        let node = this.treeNodes[path[0]];
        for (let i = 1; i < path.length; i++) {
            node = node.nodes[path[i]];
        }
        return node;
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
        let parentID: string = node.id.substring(0, node.id.length - 2);
        let parentNode: NodeProps = this.nodeSelector(parentID);

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

        // Evaluating the state of children:
        // If even one was partially selected we don't look at the counter,
            // otherwise if the counter is full then it is selected,
            // otherwise if bigger than zero then partially selected
            // and if zero then it is unselected.
        if ( state === false ) {
            if (checkedCounter === parentNode.nodes.length) {
                state = true;
            } else if (checkedCounter > 0) {
                state = undefined;
            }
        }

        parentNode.state.checked = state;
        this.parentSelectButtonChange(state, parentNode);
    }

    /**
     * Changes the sate of the node and all children recursively.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     * @param {boolean} directlyChanged Defines if changed by user or just the recursive call.
     */
    private nodeSelectButtonChange(checked: boolean, node: NodeProps, directlyChanged: boolean = false): void {
        if ( node.nodes ) {
            node.state.checked = checked;

            if ( this.props.onDataChange ) {
                this.props.onDataChange(node.id, 'state.checked', node.state.checked);
            }

            if ( this.props.hierarchicalCheck ) {

                // Init node because if we don't do it children with no state property wont be selected.
                if ( !node.initialized ) {
                    this.initNode(node);
                }

                // Set checkbox state for all children nodes.
                for (let i = 0; i < node.nodes.length; i++) {
                    this.nodeSelectButtonChange(checked, node.nodes[i]);
                }
            }
        }

        if ( directlyChanged && this.props.hierarchicalCheck ) {
            this.parentSelectButtonChange(node.state.checked, node);
        }
    }

    /**
     * Handles checkbox change if made on checkbox.
     *
     * @param {boolean} checked The checkbox new state.
     * @param {string} id The element which checkbox was changed.
     */
    private handleSelectButtonChange = (checked: boolean, id: string): void => {
        let node: NodeProps = this.nodeSelector(id);
        this.nodeSelectButtonChange(checked, node, true);
        this.update();
    }

    /**
     * Handles the expanding and collapsing elements.
     * If passed onDataChange function then calls it.
     *
     * @param {string} id The id of node which has changed.
     * @param {boolean} expanded The current state
     */
    private handleExpandedChange = (id: string, expanded: boolean): void => {
        let node: NodeProps = this.nodeSelector(id);
        this.initNode(node);
        node.state.expanded = expanded;

        if ( this.props.onDataChange ) {
            this.props.onDataChange(node.id, 'state.expanded', expanded);
        }

        this.update();
    }
}
