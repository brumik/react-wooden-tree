import * as React from "react";
import {ItemProps, Item, ItemPropsFactory} from "./Item"
import {defVal} from "./Helpers";
import {CheckboxData, CheckboxDataFactory} from "./Checkbox";

export interface ListProps {
    id?: string,
    items?: ItemProps[],
    checkbox?: CheckboxData
}

export function ListPropsFactory(list: ListProps) : ListProps {
    let items: ItemProps[] = [];
    if ( list.items != null )
        for (let i = 0; i < list.items.length; i++) {
            list.items[i].checkbox = CheckboxDataFactory(list.items[i].checkbox, list.checkbox.onChange);
            list.items[i].id = list.id + "." + i;
            items.push(ItemPropsFactory(list.items[i]));
        }

    return {
        id: list.id,
        items: items,
        checkbox: list.checkbox,
    }
}

interface ListState {}

export class List extends React.Component<ListProps, ListState> {
    render() {
        let items : JSX.Element[] = this.props.items.map((item) =>
            (
                <Item key={item.id}
                      id={item.id}
                      label={item.label}
                      list={item.list}
                      opened={defVal(item.opened, false)}
                      checkbox={item.checkbox}
                />
            )
        );
        return (
            <ul>
                {items}
            </ul>
        )
    }
}