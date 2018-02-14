import * as React from "react";
import { defVal } from "./Helpers";
import {Checkbox, CheckboxData, CheckboxDataFactory} from "./Checkbox";
import {FormEvent} from "react";

export interface ItemProps {
    id?: string,
    label: string,
    items?: ItemProps[],
    checkbox?: CheckboxData,
    opened?: boolean,
}

export function ItemPropsFactory(item : ItemProps) : ItemProps {
    let items: ItemProps[] = [];
    if ( item.items != null )
        for (let i = 0; i < item.items.length; i++) {
            item.items[i].checkbox = CheckboxDataFactory(item.items[i].checkbox, item.checkbox.onChange);
            item.items[i].id = item.id + "." + i;
            items.push(ItemPropsFactory(item.items[i]));
        }

    return {
        id: item.id,
        label: item.label,
        items: items,
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

    renderSublist() : JSX.Element[] {
        if (this.props.items  && this.props.opened) {
            return this.props.items.map((item) =>
                (
                    <Item key={item.id}
                          id={item.id}
                          label={item.label}
                          items={item.items}
                          opened={defVal(item.opened, false)}
                          checkbox={item.checkbox}
                    />
                )
            );
        } else return null;
    }

    render () {
        return (
            <li>
                <Checkbox onChange={this.handleCheckChange} checked={this.props.checkbox.checked}/>
                {this.props.label}
                <ul>{this.renderSublist()}</ul>
            </li>
        )
    }
}