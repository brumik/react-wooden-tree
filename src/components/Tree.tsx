import * as React from "react";
import { ListProps, List } from "./List";

export interface TreeProps {
    id: string
    list?: ListProps
}

interface TreeState {
}

export class Tree extends React.Component<TreeProps, TreeState> {
    constructor(props: TreeProps) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id}>
                <p>Will be a tree</p>
                <List
                    id={this.props.id}
                    {...this.props.list}
                />
            </div>
        );
    }
}