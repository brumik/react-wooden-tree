import * as React from "react";
import {List, ListProps, ListPropsFactory} from "./List";
import { defVal } from "./Helpers";
import {Checkbox, CheckboxData, CheckboxDataFactory} from "./Checkbox";
import {FormEvent} from "react";

export interface ItemProps {
    id?: string,
    label: string,
    list?: ListProps,
    checkbox?: CheckboxData,
    opened?: boolean,
}

export function ItemPropsFactory(item : ItemProps) : ItemProps {
    let list = item.list;
    if ( list != null ) {
        list.id = item.id
        list.checkbox = CheckboxDataFactory(list.checkbox, item.checkbox.onChange);
        list = ListPropsFactory(list);
    }

    return {
        id: item.id,
        label: item.label,
        list: list,
        checkbox: item.checkbox,
        opened: defVal(item.opened, false)
    }
}

interface ItemState {}

export class Item extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);

        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    handleCheckChange(event : FormEvent<HTMLInputElement>) : void {
        const target = event.target as HTMLInputElement;
        this.props.checkbox.onChange(target.checked, this.props.id);
    }

    renderSublist() : JSX.Element {
        if (this.props.list && this.props.list.items && this.props.opened) {
            return (
                <List
                    id={this.props.id}
                    items={this.props.list.items}
                    checkbox={this.props.checkbox}
                />
            );
        } else return null;
    }

    render () {
        return (
            <li>
                <Checkbox onChange={this.handleCheckChange} checked={this.props.checkbox.checked}/>
                {this.props.label}
                {this.renderSublist()}
            </li>
        )
    }
}