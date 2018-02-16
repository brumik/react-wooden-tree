import * as React from "react";
import {Node, NodeProps, NodePropsFactory} from "./Node";
import {CheckboxDataFactory} from "./Checkbox";
import {ExpandboxDataFactory} from "./Expandbox";

export interface TreeProps {
    tree: NodeProps,
    checkboxes?: boolean
}

interface TreeState {
    node: NodeProps
}

export class Tree extends React.Component<TreeProps, TreeState> {
    /** The variable to maintain hierarchical changes on state. */
    node : NodeProps;

    constructor(props: TreeProps) {
        super(props);

        this.node = this.initList(this.props.tree);

        this.state = {
            node: this.node,
        };
    }

    /**
     * Initializes the first list node and other are initialized recursively.
     *
     * @param {NodeProps} node
     * @returns {NodeProps}
     */
    initList(node : NodeProps) : NodeProps {
        node.id = "0";
        node.checkbox = CheckboxDataFactory(node.checkbox, this.handleCheckboxChange, this.props.checkboxes);
        node.expandButton = ExpandboxDataFactory(node.expanded, this.handleExpandedChange);
        node.expanded = true;
        node = NodePropsFactory(node);
        return node;
    }

    /**
     * Searches for the node by id. And returns it.
     * @param {string} id
     * @returns {NodeProps}
     */
    nodeSelector(id : string) : NodeProps {
        let path : number[] = id.split('.').map(function(node) {
            return parseInt(node, 10);
        });

        let node = this.node;
        for(let i = 1; i < path.length; i++) {
            node = node.nodes[path[i]];
        }
        return node;
    }

    /**
     * Uses recurse to update all parent if a checkbox is checked.
     *
     * @param {boolean} checked The new state of the child.
     * @param {NodeProps} node The child node.
     */
    parentCheckboxChange(checked: boolean, node : NodeProps) : void {
        // Root node:
        if ( node.id === "0" ) return;
        // Others:
        let parentID : string = node.id.substring(0, node.id.length - 2);
        let parentNode : NodeProps = this.nodeSelector(parentID);

        parentNode.checkbox.childrenCheckedCount += checked ? 1 : -1;
        if ( parentNode.checkbox.childrenCheckedCount === parentNode.nodes.length ) {
            parentNode.checkbox.checked = true;
            this.parentCheckboxChange(true, parentNode);
        } else {
            parentNode.checkbox.checked = false;
            this.parentCheckboxChange(false, parentNode);
        }
    }

    /**
     * Changes the sate of the node and all children recursively.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     * @param {boolean} directlyChanged Defines if changed by user or just the recursive call.
     */
    nodeCheckboxChange(checked: boolean, node : NodeProps, directlyChanged = false) : void {
        if ( node.nodes ) {
            node.checkbox.checked = checked;
            node.checkbox.childrenCheckedCount = checked ? node.nodes.length : 0;
            for(let i = 0; i < node.nodes.length; i++)
                this.nodeCheckboxChange(checked, node.nodes[i]);
        }

        if ( directlyChanged )
            this.parentCheckboxChange(checked, node);
    }

    /**
     * Handles checkbox change if made on checkbox.
     *
     * @param {boolean} checked The checkbox new state.
     * @param {string} id The element which checkbox was changed.
     */
    handleCheckboxChange = (checked : boolean, id : string) : void => {
        let node : NodeProps = this.nodeSelector(id);
        this.nodeCheckboxChange(checked, node, true);
        this.setState({node: this.node});
    };

    /**
     * Handles the expanding and collapsing elements.
     * @param {string} id The id of node which has changed.
     * @param {boolean} expanded The current state
     */
    handleExpandedChange = (id: string, expanded: boolean) : void => {
        let node : NodeProps = this.nodeSelector(id);
        node.expanded = expanded;
        this.setState({node: this.node});
    };

    render() {
        return (
            <div >
                <Node key={this.state.node.id}
                      id={this.state.node.id}
                      text={this.state.node.text}
                      nodes={this.state.node.nodes}
                      expanded={this.state.node.expanded}
                      expandButton={this.state.node.expandButton}
                      checkbox={this.state.node.checkbox}
                />
            </div>
        );
    }
}