import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Node, NodeProps, NodePropsFactory, NodeStateFactory } from './Node';
import { SelectButtonState, SelectButtonDataFactory } from './SelectButton';
import { ExpandButtonDataFactory } from './ExpandButton';
import './Node.css';

export interface TreeProps {
    tree: NodeProps;
    checkable?: boolean;
}

interface TreeState {
    node: NodeProps;
}

export class Tree extends React.Component<TreeProps, TreeState> {
    /** The variable to maintain hierarchical changes on state. */
    treeNodes: NodeProps;

    /**
     * Constructor.
     * @param {TreeProps} props
     */
    constructor(props: TreeProps) {
        super(props);

        this.treeNodes = this.initList(this.props.tree);

        this.state = {
            node: this.treeNodes,
        };
    }

    /**
     * Initializes the first list node and other are initialized recursively.
     *
     * @param {NodeProps} node
     * @returns {NodeProps}
     */
    initList(node: NodeProps): NodeProps {
        node.id = '0';

        node.state = NodeStateFactory(node.state);
        node.state.expanded = true;
        node.checkable = this.props.checkable;

        node.checkbox = SelectButtonDataFactory(node.state.checked, this.handleSelectButtonChange);
        node.expandButton = ExpandButtonDataFactory(node.state.expanded, this.handleExpandedChange);

        node = NodePropsFactory(node);
        return node;
    }

    /**
     * Searches for the node by id, and returns it.
     * Search is done by walking the tree by index numbers got form the id.
     *
     * @param {string} id
     * @returns {NodeProps}
     */
    nodeSelector(id: string): NodeProps {
        let path: number[] = id.split('.').map(function(nodeId: string) {
            return parseInt(nodeId, 10);
        });

        let node = this.treeNodes;
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
    parentSelectButtonChange(checked: SelectButtonState, node: NodeProps): void {
        // Root node:
        if ( node.id === '0' ) { return; }

        // Others:
        let parentID: string = node.id.substring(0, node.id.length - 2);
        let parentNode: NodeProps = this.nodeSelector(parentID);

        let state = SelectButtonState.Unselected;
        let checkedCounter = 0;
        for (let i = 0; i < parentNode.nodes.length; i++) {
            let currState = parentNode.nodes[i].checkbox.checked;

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
        // If even one was partially selected we don't look at the counter
        if ( state === SelectButtonState.Unselected ) {
            if (checkedCounter === parentNode.nodes.length) {
                state = SelectButtonState.Selected;
            } else if (checkedCounter > 0) {
                state = SelectButtonState.PartiallySelected;
            }
        }

        parentNode.checkbox.checked = state;
        this.parentSelectButtonChange(state, parentNode);
    }

    /**
     * Changes the sate of the node and all children recursively.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     * @param {boolean} directlyChanged Defines if changed by user or just the recursive call.
     */
    nodeSelectButtonChange(checked: boolean, node: NodeProps, directlyChanged: boolean = false): void {
        if ( node.nodes ) {
            node.checkbox.checked = checked ? SelectButtonState.Selected : SelectButtonState.Unselected;
            for (let i = 0; i < node.nodes.length; i++) {
                this.nodeSelectButtonChange(checked, node.nodes[i]);
            }
        }

        if ( directlyChanged ) {
            this.parentSelectButtonChange(node.checkbox.checked, node);
        }
    }

    /**
     * Handles checkbox change if made on checkbox.
     *
     * @param {boolean} checked The checkbox new state.
     * @param {string} id The element which checkbox was changed.
     */
    handleSelectButtonChange = (checked: boolean, id: string): void => {
        let node: NodeProps = this.nodeSelector(id);
        this.nodeSelectButtonChange(checked, node, true);
        this.setState({node: this.treeNodes});
    }

    /**
     * Handles the expanding and collapsing elements.
     * @param {string} id The id of node which has changed.
     * @param {boolean} expanded The current state
     */
    handleExpandedChange = (id: string, expanded: boolean): void => {
        let node: NodeProps = this.nodeSelector(id);
        node.state.expanded = expanded;
        this.setState({node: this.treeNodes});
    }

    render() {
        return (
            <div className="Tree">
                <ul>
                    <Node
                        key={this.state.node.id}
                        id={this.state.node.id}
                        text={this.state.node.text}
                        nodes={this.state.node.nodes}
                        state={this.state.node.state}
                        expandButton={this.state.node.expandButton}
                        checkbox={this.state.node.checkbox}
                        checkable={this.state.node.checkable}
                    />
                </ul>
            </div>
        );
    }
}
