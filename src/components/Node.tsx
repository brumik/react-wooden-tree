import * as React from "react";
import { defVal } from "./Helpers";
import {Checkbox, CheckboxData, CheckboxDataFactory} from "./Checkbox";
import {FormEvent} from "react";
import {Expandbox, ExpandboxData, ExpandboxDataFactory} from "./Expandbox";

export interface NodeProps {
    id?: string,
    text: string,
    nodes?: NodeProps[],
    expanded?: boolean,

    // TODO
    icon?: string,
    image?: string,
    selectedIcon?: string,
    color?: string,
    backColor?: string,
    iconColor?: string,
    selectable?: boolean,
    checkable?: boolean,
    state?: {
        checked?: boolean,
        disabled?: boolean,
        expanded?: boolean,
        selected?: boolean,
    },
    classes?: string,
    hideCheckbox?: boolean,

    // Private
    checkbox?: CheckboxData,
    expandButton?: ExpandboxData,
}

export function NodePropsFactory(node : NodeProps) : NodeProps {
    let nodes: NodeProps[] = [];
    if ( node.nodes != null )
        for (let i = 0; i < node.nodes.length; i++) {
            node.nodes[i].checkbox = CheckboxDataFactory(node.nodes[i].checkbox, node.checkbox.onChange, node.checkbox.visible);

            // Count the checked children nodes.
            if (node.nodes[i].checkbox.checked)
                node.checkbox.childrenCheckedCount++;

            node.nodes[i].id = node.id + "." + i;
            node.nodes[i].expandButton = ExpandboxDataFactory(node.nodes[i].expanded, node.expandButton.onChange);
            nodes.push(NodePropsFactory(node.nodes[i]));
        }

    return {
        id: node.id,
        text: node.text,
        nodes: nodes,
        checkbox: node.checkbox,
        expanded: defVal(node.expanded, false),
        expandButton: node.expandButton,
    }
}

interface NodeState {}

export class Node extends React.Component<NodeProps, NodeState> {
    constructor(props: NodeProps) {
        super(props);

        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
    }

    /**
     * Own checkbox handler.
     * @param {boolean} checked Contains the input field value.
     */
    handleCheckChange(checked: boolean) : void {
        this.props.checkbox.onChange(checked, this.props.id);
    }

    handleOpenChange(event : FormEvent<HTMLInputElement>) : void {
        const target = event.target as HTMLInputElement;
        this.props.expandButton.onChange(this.props.id, target.checked);
    }

    /**
     * @returns {JSX.Element[]} The rendered nodes.
     */
    renderSublist() : JSX.Element[] {
        if (this.props.nodes  && this.props.expanded) {
            let nodes : JSX.Element[] = [];
            for(let i = 0; i < this.props.nodes.length; i++) {
                nodes.push(
                    <Node key={this.props.nodes[i].id}
                          id={this.props.nodes[i].id}
                          text={this.props.nodes[i].text}
                          nodes={this.props.nodes[i].nodes}
                          expanded={this.props.nodes[i].expanded}
                          expandButton={this.props.nodes[i].expandButton}
                          checkbox={this.props.nodes[i].checkbox}
                    />
                );
            }
            return nodes;
        } else return null;
    }

    render () {
        let checkbox = this.props.checkbox.visible ? (
            <Checkbox onChange={this.handleCheckChange} checked={this.props.checkbox.checked} />
        ) : null;

        let openButton = this.props.nodes.length > 0 ? (
            <Expandbox onChange={this.handleOpenChange} expanded={this.props.expanded}/>
        ) : null;

        return (
            <li>
                {checkbox}
                {this.props.text}
                {openButton}
                <ul>{this.renderSublist()}</ul>
            </li>
        )
    }
}