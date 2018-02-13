import * as React from "react";
import {List, ListProps, ListPropsFactory} from "./List";
import {defVal} from "./Helpers";
import {ItemProps, ItemPropsFactory} from "./Item";
import {CheckboxData, CheckboxDataFactory} from "./Checkbox";

export interface TreeProps {
    list: ListProps,
    checkboxes?: boolean
}

interface TreeState {
    checked: boolean,
    list: ListProps,
}

export class Tree extends React.Component<TreeProps, TreeState> {
    constructor(props: TreeProps) {
        super(props);

        this.state = {
            checked: false,
            list: this.initList(this.props.list),
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    initList(list : ListProps) : ListProps {
        list.id = "0";
        list.checkbox = CheckboxDataFactory(list.checkbox, this.handleCheckboxChange);
        list = ListPropsFactory(list);
        return list;
    }

    handleCheckboxChange(checked : boolean, id : string) : void {
        console.log("Check: " + checked + " id: " + id);
    }

    render() {
        return (
            <div >
                <p>Will be a tree 2</p>
                <List
                    items={this.state.list.items}
                    checkbox={this.state.list.checkbox}
                />
            </div>
        );
    }
}