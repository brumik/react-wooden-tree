import * as React from "react";
import {Item, ItemProps, ItemPropsFactory} from "./Item";
import {CheckboxDataFactory} from "./Checkbox";

export interface TreeProps {
    tree: ItemProps,
    checkboxes?: boolean
}

interface TreeState {
    checked: boolean,
    item: ItemProps
}

export class Tree extends React.Component<TreeProps, TreeState> {
    constructor(props: TreeProps) {
        super(props);

        this.state = {
            checked: false,
            item: this.initList(this.props.tree),
        };
    }

    initList(item : ItemProps) : ItemProps {
        item.id = "0";
        item.checkbox = CheckboxDataFactory(item.checkbox, this.handleCheckboxChange);
        item = ItemPropsFactory(item);

        let items: ItemProps[] = [];
        if ( item.items != null )
            for (let i = 0; i < item.items.length; i++) {
                item.items[i].checkbox = CheckboxDataFactory(item.items[i].checkbox, item.checkbox.onChange);
                item.items[i].id = item.id + "." + i;
                items.push(ItemPropsFactory(item.items[i]));
            }

        item.items = items;
        item.opened = true;
        return item;
    }

    nodeSelector(id : string) : ItemProps {
        let path : number[] = id.split('.').map(function(item) {
            return parseInt(item, 10);
        });

        let node = this.state.item;
        for(let i = 1; i < path.length; i++) {
            node = node.items[path[i]];
        }
        return node;
    }

    handleCheckboxChange = (checked : boolean, id : string) : void => {
        console.log("Check: " + checked + " id: " + id, this);
        let node : ItemProps = this.nodeSelector(id);
        node.checkbox.checked = checked;
    };

    render() {
        return (
            <div >
                <ul>
                    <Item key={this.state.item.id}
                          id={this.state.item.id}
                          label={this.state.item.label}
                          items={this.state.item.items}
                          opened={this.state.item.opened}
                          checkbox={this.state.item.checkbox}
                    />
                </ul>
            </div>
        );
    }
}