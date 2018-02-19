import * as React from 'react';
import { defVal } from './Helpers';
import { SelectButton, SelectButtonData, SelectButtonDataFactory } from './SelectButton';
import { ExpandButton, ExpandButtonData, ExpandButtonDataFactory } from './ExpandButton';

/**
 * Interface for the node's state property.
 */
interface NodeState {
    checked?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
}

/**
 * Node properties interface.
 */
export interface NodeProps {
    id?: string;
    text: string;
    nodes?: NodeProps[];
    state?: NodeState;
    checkable?: boolean;

    // TODO
    icon?: string;
    image?: string;
    selectedIcon?: string;
    color?: string;
    backColor?: string;
    iconColor?: string;
    selectable?: boolean;
    classes?: string;
    hideSelectButton?: boolean;

    // Private
    checkbox?: SelectButtonData;
    expandButton?: ExpandButtonData;
}

/**
 * Generates a new state from given values or by default all values false.
 *
 * @param {NodeState} state The already existing state. Top priority value.
 * @param {NodeState} parentState The parent state. Optional. Second priority value
 * (expect expanded -> false if not in state). A copy of this is returned if state is null.
 * @returns {NodeState} The new state. If state and parentState are both null then all values are set as false.
 * @constructor
 */
export function NodeStateFactory(state: NodeState, parentState: NodeState = null): NodeState {
    if ( state != null && parentState != null ) {
        return {
            checked: defVal(state.checked, parentState.checked),
            disabled: defVal(state.disabled, parentState.disabled),
            expanded: defVal(state.expanded, false),
            selected: defVal(state.selected, parentState.selected)
        };
    } else if ( state != null && parentState == null ) {
        return {
            checked: defVal(state.checked, false),
            disabled: defVal(state.disabled, false),
            expanded: defVal(state.expanded, false),
            selected: defVal(state.selected, false)
        };
    } else if ( state == null && parentState != null ) {
        return {
            checked: parentState.checked,
            disabled: parentState.disabled,
            expanded: false,
            selected: parentState.selected
        };
    } else {
        return {checked: false, disabled: false, expanded: false, selected: false};
    }
}

/**
 * TODO Commentary
 *
 * @param {NodeProps} node
 * @returns {NodeProps}
 * @constructor
 */
export function NodePropsFactory(node: NodeProps): NodeProps {
    let nodes: NodeProps[] = [];
    if ( node.nodes != null ) {
        for (let i = 0; i < node.nodes.length; i++) {
            let current = node.nodes[i];
            current.id = node.id + '.' + i;
            current.state = NodeStateFactory(current.state, node.state);

            current.checkbox = SelectButtonDataFactory(current.state.checked, node.checkbox.onChange);
            current.checkable = defVal(current.checkable, node.checkable);

            current.expandButton = ExpandButtonDataFactory(current.state.expanded, node.expandButton.onChange);

            nodes.push(NodePropsFactory(current));
        }
    }

    return {
        id: node.id,
        text: node.text,
        nodes: nodes,
        checkable: node.checkable,
        checkbox: node.checkbox,
        state: node.state,
        expandButton: node.expandButton,
    };
}

/**
 * @class Node
 * @extends React.Component
 *
 * Displays a node and communicates with submodules and tree.
 */
export class Node extends React.Component<NodeProps, {}> {
    constructor(props: NodeProps) {
        super(props);

        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
    }

    /**
     * Own checkbox handler.
     * @param {boolean} checked Contains the input field value.
     */
    handleCheckChange(checked: boolean): void {
        this.props.checkbox.onChange(checked, this.props.id);
    }

    handleOpenChange(expanded: boolean): void {
        this.props.expandButton.onChange(this.props.id, expanded);
    }

    /**
     * @returns {JSX.Element[]} The rendered nodes.
     */
    renderSublist(): JSX.Element[] {
        if (this.props.nodes && this.props.state.expanded) {
            let nodes: JSX.Element[] = [];
            for (let i = 0; i < this.props.nodes.length; i++) {
                nodes.push(
                    <Node
                        key={this.props.nodes[i].id}
                        id={this.props.nodes[i].id}
                        text={this.props.nodes[i].text}
                        nodes={this.props.nodes[i].nodes}
                        state={this.props.nodes[i].state}
                        expandButton={this.props.nodes[i].expandButton}
                        checkbox={this.props.nodes[i].checkbox}
                        checkable={this.props.nodes[i].checkable}
                    />
                );
            }
            return nodes;
        } else { return null; }
    }

    /**
     * Returns the computed padding size for the current list item for indent.
     * @returns {number} The computed padding size in pixels.
     */
    getItemSpanIndents(): JSX.Element[] {
        let spans: JSX.Element[] = [];
        for (let i = 0; i < this.props.id.split('.').length - 1; i++) {
            spans.push(<span key={i} className="indent" />);
        }

        return spans;
    }

    render () {
        let checkbox = this.props.checkable ? (
            <SelectButton onChange={this.handleCheckChange} checked={this.props.checkbox.checked} />
        ) : null;

        let openButton = this.props.nodes.length > 0 ? (
            <ExpandButton onChange={this.handleOpenChange} expanded={this.props.state.expanded}/>
        ) : <span className="Placeholder" />;

        return (
            <React.Fragment>
                <li>
                    {this.getItemSpanIndents()}
                    {openButton}
                    {checkbox}
                    {this.props.text}
                </li>
                {this.renderSublist()}
            </React.Fragment>
        );
    }
}
