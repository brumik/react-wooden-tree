import * as React from "react";
import {FormEventHandler} from "react";


export interface OpenButtonProps {
    onChange: FormEventHandler<HTMLInputElement>,
    opened: boolean,
}

export class OpenButton extends React.Component<OpenButtonProps, {}> {
    render() {
        return (
            <input type="checkbox"
                   checked={this.props.opened}
                   onChange={this.props.onChange}
            />
        );
    }
}
