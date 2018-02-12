import * as React from "react";
import { List } from "./List";
import {defVal} from "./Helpers";

export interface TreeProps {
    id: string
    items?: any
    checkboxes?: boolean
}

interface TreeState {
    checked: boolean,
}

export class Tree extends React.Component<TreeProps, TreeState> {
    constructor(props: TreeProps) {
        super(props);

        this.state = {
            checked: false
        }
    }

    render() {
        return (
            <div >
                <p>Will be a tree 2</p>
                <List
                    id={this.props.id}
                    items={this.props.items}
                    checkbox={{
                        visible: defVal(this.props.checkboxes, false),
                        checked: this.state.checked,
                        onChange: (checked) => this.setState({checked: checked}),
                    }}
                />
            </div>
        );
    }
}