import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Node, NodeProps, ParentData } from './Node';
import { SelectButtonState } from './SelectButton';
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

    /** @defgroup MethodsGroup
     * The public methods used to manipulate the tree programmatically.
     *  @{
     */
    // TODO: Required methods:
    // addNode, addNodeAfter, addNodeBefore
    // findNodes
    // remove, removeNode, revealNode
    // search, selectNode, clearSearch
    // updateNode, unmarkCheckboxChanges
    // unselectNode

    /**
     * Expands all nodes which have children. If node were not initialized then does it too.
     */
    public expandAll(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            if ( node.nodes && node.nodes.length > 0 ) {
                self.initNode(node);
                node.state.expanded = true;
            }
        });

        this.update();
    }

    /**
     * Expands the given node(s). If not initialized then does it too.
     * Invalid ids are just skipped.
     *
     * @param {string[]} ids The array of node IDs.
     */
    public expandNode(ids: string[]): void {
        for (let i = 0; i < ids.length; i++) {
            let node = this.nodeSelector(ids[i]);
            if ( !node ) { continue; }

            if ( node.nodes && node.nodes.length > 0 ) {
                this.initNode(node);
                node.state.expanded = true;
            }
        }

        this.update();
    }

    /**
     * Collapses nodes which are initialized (not initialized are not displayed)
     */
    public collapseAll(): void {
        this.iterateAll(function (node: NodeProps): void {
            node.state.expanded = false;
        });

        this.update();
    }

    /**
     * Collapses the given node(s), only if were initialized.
     * Invalid ids are just skipped.
     *
     * @param {string[]} ids The array of node IDs
     */
    public collapseNode(ids: string[]): void {
        for (let i = 0; i < ids.length; i++) {
            let node = this.nodeSelector(ids[i]);
            if ( !node ) { continue; }

            if ( node.initialized ) {
                node.state.expanded = false;
            }
        }

        this.update();
    }

    /**
     * All nodes are set to checked. If node not initialized then does it too.
     */
    public checkAll(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.checked = SelectButtonState.Selected;
        });

        this.update();
    }

    /**
     * Sets the node(s) to checked. If node(s) are not initialized then does it too.
     * Invalid ids are just skipped.
     *
     * @param {string[]} ids
     */
    public checkNode(ids: string[]): void {
        for (let i = 0; i < ids.length; i++) {
            let node = this.nodeSelector(ids[i]);
            if ( !node ) { continue; }

            this.initNode(node);
            node.state.checked = SelectButtonState.Selected;
        }

        this.update();
    }

    /**
     * All nodes are set to unchecked. If node not initialized then does it too.
     */
    public uncheckAll(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.checked = SelectButtonState.Unselected;
        });

        this.update();
    }

    /**
     * Sets the node(s) to unchecked. If node(s) are not initialized then does it too.
     * Invalid ids are just skipped.
     *
     * @param {string[]} ids
     */
    public uncheckNode(ids: string[]): void {
        for (let i = 0; i < ids.length; i++) {
            let node = this.nodeSelector(ids[i]);
            if ( !node ) { continue; }

            this.initNode(node);
            node.state.checked = SelectButtonState.Unselected;
        }

        this.update();
    }

    /**
     * All nodes are disabled. If node not initialized then does it too.
     */
    public disableAll(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.disabled = true;
        });

        this.update();
    }

    /**
     * Sets the node(s) to disabled. If node(s) are not initialized then does it too.
     * Invalid ids are just skipped.
     *
     * @param {string[]} ids
     */
    public disableNode(ids: string[]): void {
        for (let i = 0; i < ids.length; i++) {
            let node = this.nodeSelector(ids[i]);
            if ( !node ) { continue; }

            this.initNode(node);
            node.state.disabled = true;
        }

        this.update();
    }

    /**
     * All nodes are enabled. If node not initialized then does it too.
     */
    public enableAll(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.disabled = false;
        });

        this.update();
    }

    /**
     * Sets the node(s) enabled. If node(s) are not initialized then does it too.
     * Invalid ids are just skipped.
     *
     * @param {string[]} ids
     */
    public enableNode(ids: string[]): void {
        for (let i = 0; i < ids.length; i++) {
            let node = this.nodeSelector(ids[i]);
            if ( !node ) { continue; }

            this.initNode(node);
            node.state.disabled = false;
        }

        this.update();
    }

    /**
     * Toggles the checked state. (Does not touch partially selected nodes).
     */
    public toggleNodeChecked(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            if ( node.state.checked === SelectButtonState.Selected ) {
                node.state.checked = SelectButtonState.Unselected;
            } else if ( node.state.checked === SelectButtonState.Unselected ) {
                node.state.checked = SelectButtonState.Selected;
            }
        });

        this.update();
    }

    /**
     * Toggles the expanded state.
     */
    public toggleNodeExpanded(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.expanded = !node.state.expanded;
        });

        this.update();
    }

    /**
     * Toggles the disabled state.
     */
    public toggleNodeDisabled(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.disabled = !node.state.disabled;
        });

        this.update();
    }

    /**
     * Toggles the selected state.
     */
    public toggleNodeSelected(): void {
        // Save reference
        const self = this;

        // Pass the logic as callback to node iterator.
        this.iterateAll(function(node: NodeProps): void {
            self.initNode(node);
            node.state.selected = !node.state.selected;
        });

        this.update();
    }

    /**
     * Returns all node ids which are checked.
     *
     * @param {boolean} partially If true returns nodes which are partially checked too.
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getChecked(partially: boolean = false): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( !partially ) {
                if ( node.state.checked === SelectButtonState.Selected ) {
                    ids.push(node.id);
                }
            } else {
                if ( node.state.checked === SelectButtonState.Selected ||
                     node.state.checked === SelectButtonState.PartiallySelected) {
                    ids.push(node.id);
                }
            }

        });

        return ids;
    }

    /**
     * Returns all node ids which are unchecked.
     *
     * @param {boolean} partially If true returns nodes which are partially checked too.
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getUnchecked(partially: boolean = false): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( !partially ) {
                if ( node.state.checked === SelectButtonState.Unselected ) {
                    ids.push(node.id);
                }
            } else {
                if ( node.state.checked === SelectButtonState.Unselected ||
                    node.state.checked === SelectButtonState.PartiallySelected) {
                    ids.push(node.id);
                }
            }

        });

        return ids;
    }

    /**
     * Returns all node ids which are expanded.
     *
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getExpanded(): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( node.state.expanded ) {
                ids.push(node.id);
            }
        });

        return ids;
    }

    /**
     * Returns all node ids which are collapsed.
     *
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getCollapsed(): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( !node.state.expanded ) {
                ids.push(node.id);
            }
        });

        return ids;
    }

    /**
     * Returns all node ids which are disabled.
     *
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getDisabled(): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( node.state.disabled ) {
                ids.push(node.id);
            }
        });

        return ids;
    }

    /**
     * Returns all node ids which are enabled.
     *
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getEnabled(): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( !node.state.disabled ) {
                ids.push(node.id);
            }
        });

        return ids;
    }

    /**
     * Returns all node ids which are selected.
     *
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getSelected(): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( node.state.selected ) {
                ids.push(node.id);
            }
        });

        return ids;
    }

    /**
     * Returns all node ids which are unselected.
     *
     * @returns {string[]} Array of ids of nodes which passed the filter.
     */
    public getUnselected(): string[] {
        let ids: string[] = [];

        const self = this;
        this.iterateAll(function (node: NodeProps): void {
            self.initNode(node);

            if ( !node.state.selected ) {
                ids.push(node.id);
            }
        });

        return ids;
    }

    /**
     * Returns all parent ids to the given nodes. The parents are ordered by the following:
     * From the give node to the last and each has its parents from the closest to the farthest.
     *
     * One node can be listed more than one time. Does not initializes the nodes.
     * Invalid node ids are skipped.
     *
     * @param {string[]} nodes The nodes to get the parents ids.
     * @param {number} levels The max number of distance of the parent. If 0 then to the root.
     * @returns {string[]} The parents ids of the given nodes.
     */
    public getParents(nodes: string[], levels: number = 0): string[] {
        let ids: string[] = [];

        // For all passed nodes:
        for (let i = 0; i < nodes.length; i++) {

            // Checking if node exists.
            if ( !this.nodeSelector(nodes[i]) ) { continue; }

            let tempID = nodes[i];

            if ( levels <= 0 ) {
                // Extract ids backwards to the root from the current one.
                while (tempID.length > 1) {
                    tempID = tempID.slice(0, tempID.lastIndexOf('.'));
                    ids.push(tempID);
                }
            } else {
                // Extract ids backwards to the specified level or the root from the current one.
                while (tempID.length > 1 && levels > 0) {
                    tempID = tempID.slice(0, tempID.lastIndexOf('.'));
                    ids.push(tempID);
                    levels--;
                }
            }
        }

        return ids;
    }

    /**
     * Returns the sibling (and the given node as well) to the given nodes.
     * If parent was not initialized then does it. Invalid node ids are skipped.
     *
     * @param {string[]} nodes The nodes to get the siblings ids.
     * @returns {string[]} The sibling ids (counted the given node ids too).
     */
    public getSiblings(nodes: string[]): string[] {
        let ids: string[] = [];

        // Checking if node exists is done in the getParent method.
        let parents = this.getParents(nodes, 1)[0]; // Getting only the closest parents.

        for (let i = 0; i < parents.length; i++) {
            let parent = this.nodeSelector(parents[i]);

            // Making sure that parent is initialized and have children (can pass any ID to the method).
            this.initNode(parent);
            if ( !parent.nodes ) { continue; }

            for (let l = 0; l < parent.nodes.length; l++) {
                ids.push(parent.nodes[l].id);
            }
        }

        return ids;
    }

    /** @} */ // end of MethodsGroup

    /**
     * Iterates trough all initialized nodes and passes each of them to the callback function.
     *
     * @param {(node: NodeProps) => void} callback
     * @param {NodeProps[]} nodes
     */
    private iterateAll(callback: (node: NodeProps) => void, nodes: NodeProps[] = this.treeNodes) {
        for (let i = 0; i < nodes.length; i++) {
            callback(nodes[i]);
            if ( nodes[i].initialized ) {
                this.iterateAll(callback, nodes[i].nodes);
            }
        }
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
     * @param {SelectButtonState} checked The new state of the child.
     * @param {NodeProps} node The child node.
     */
    private parentSelectButtonChange(checked: SelectButtonState, node: NodeProps): void {
        // Root node:
        if ( node.id.length === 1 ) { return; }

        // Others:
        let parentID: string = node.id.substring(0, node.id.length - 2);
        let parentNode: NodeProps = this.nodeSelector(parentID);

        let state = SelectButtonState.Unselected;
        let checkedCounter = 0;
        for (let i = 0; i < parentNode.nodes.length; i++) {
            let currState = parentNode.nodes[i].state.checked;

            // If even one is partially selected then the parent will be too.
            if ( currState === SelectButtonState.PartiallySelected ) {
                state = SelectButtonState.PartiallySelected;
                break;

            // Otherwise we start to count the number of selected boxes.
            } else if ( currState === SelectButtonState.Selected ) {
                checkedCounter++;
            }
        }

        // Evaluating the state of children:
        // If even one was partially selected we don't look at the counter,
            // otherwise if the counter is full then it is selected,
            // otherwise if bigger than zero then partially selected
            // and if zero then it is unselected.
        if ( state === SelectButtonState.Unselected ) {
            if (checkedCounter === parentNode.nodes.length) {
                state = SelectButtonState.Selected;
            } else if (checkedCounter > 0) {
                state = SelectButtonState.PartiallySelected;
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
            node.state.checked = checked ? SelectButtonState.Selected : SelectButtonState.Unselected;
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
     * @param {string} id The id of node which has changed.
     * @param {boolean} expanded The current state
     */
    private handleExpandedChange = (id: string, expanded: boolean): void => {
        let node: NodeProps = this.nodeSelector(id);
        this.initNode(node);
        node.state.expanded = expanded;
        this.update();
    }
}
