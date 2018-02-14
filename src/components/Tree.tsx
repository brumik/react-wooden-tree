import * as React from "react";
import {Item, NodeProps, NodePropsFactory} from "./Item";
import {CheckboxDataFactory} from "./Checkbox";

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
        node.checkbox = CheckboxDataFactory(node.checkbox, this.handleCheckboxChange);
        node = NodePropsFactory(node);
        node.opened = true;
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
        } else if ( parentNode.checkbox.childrenCheckedCount === 0 ) {
            parentNode.checkbox.checked = false;
        }
    }

    /**
     * Changes sthe sate of the node and all children recursively.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     *
     * Todo If all children are selected select parent.
     */
    nodeCheckboxChange(checked: boolean, node : NodeProps) : void {
        if ( node.nodes ) {
            node.checkbox.checked = checked;
            node.checkbox.childrenCheckedCount = checked ? node.nodes.length : 0;
            for(let i = 0; i < node.nodes.length; i++)
                this.nodeCheckboxChange(checked, node.nodes[i]);
        }

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
        this.nodeCheckboxChange(checked, node);
        this.setState({node: this.node})
    };

    render() {
        return (
            <div >
                <ul>
                    <Item key={this.state.node.id}
                          id={this.state.node.id}
                          text={this.state.node.text}
                          nodes={this.state.node.nodes}
                          opened={this.state.node.opened}
                          checkbox={this.state.node.checkbox}
                    />
                </ul>
            </div>
        );
    }
}