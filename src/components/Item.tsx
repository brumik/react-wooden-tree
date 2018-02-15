import * as React from "react";
import { defVal } from "./Helpers";
import {Checkbox, CheckboxData, CheckboxDataFactory} from "./Checkbox";
import {FormEvent} from "react";
import {OpenButton} from "./OpenButton";

export interface NodeProps {
    id?: string,
    text: string,
    nodes?: NodeProps[],
    checkbox?: CheckboxData,
    opened?: boolean,
    onOpen?: (id: string, opened: boolean) => void,
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
            node.nodes[i].onOpen = node.onOpen;
            nodes.push(NodePropsFactory(node.nodes[i]));
        }

    return {
        id: node.id,
        text: node.text,
        nodes: nodes,
        checkbox: node.checkbox,
        opened: defVal(node.opened, false),
        onOpen: node.onOpen,
    }
}

interface ItemState {}

export class Item extends React.Component<NodeProps, ItemState> {
    constructor(props: NodeProps) {
        super(props);

        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
    }

    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    handleCheckChange(event : FormEvent<HTMLInputElement>) : void {
        const target = event.target as HTMLInputElement;
        this.props.checkbox.onChange(target.checked, this.props.id);
    }

    handleOpenChange(event : FormEvent<HTMLInputElement>) : void {
        const target = event.target as HTMLInputElement;
        this.props.onOpen(this.props.id, target.checked);
    }

    /**
     * @returns {JSX.Element[]} The rendered nodes.
     */
    renderSublist() : JSX.Element[] {
        if (this.props.nodes  && this.props.opened) {
            let nodes : JSX.Element[] = [];
            for(let i = 0; i < this.props.nodes.length; i++) {
                nodes.push(
                    <Item key={this.props.nodes[i].id}
                          id={this.props.nodes[i].id}
                          text={this.props.nodes[i].text}
                          nodes={this.props.nodes[i].nodes}
                          opened={this.props.nodes[i].opened}
                          onOpen={this.props.nodes[i].onOpen}
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
            <OpenButton onChange={this.handleOpenChange} opened={this.props.opened}/>
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