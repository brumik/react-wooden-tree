import * as React from "react";
import {FormEventHandler} from "react";


interface ExpandboxProps {
    onChange: FormEventHandler<HTMLInputElement>,
    expanded: boolean,
}

interface ExpandboxOnChange {
    (id: string, opened: boolean) : void
}

export interface ExpandboxData {
    expanded: boolean,
    onChange: ExpandboxOnChange
}

export function ExpandboxDataFactory(expanded: boolean, onChange: ExpandboxOnChange) : ExpandboxData {
    return {expanded: expanded, onChange: onChange}
}

export class Expandbox extends React.Component<ExpandboxProps, {}> {
    render() {
        return (
            <input type="checkbox"
                   checked={this.props.expanded}
                   onChange={this.props.onChange}
            />
        );
    }
}
