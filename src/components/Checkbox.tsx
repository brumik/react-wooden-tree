import * as React from "react";
import {FormEventHandler} from "react";

export interface CheckboxData {
    visible: boolean,
    checked: boolean,
    onChange: (checked: boolean) => void
}

interface CheckboxProps {
    onChange: FormEventHandler<HTMLInputElement>
    checked: boolean
}

export class Checkbox extends React.Component<CheckboxProps, {}> {
    render() {
        return (
            <input type="checkbox"
                   checked={this.props.checked}
                   onChange={this.props.onChange}
            />
        )
    }
}