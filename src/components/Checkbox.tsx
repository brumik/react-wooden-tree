import * as React from "react";
import {FormEventHandler} from "react";

export interface CheckboxProps {
    onChange: FormEventHandler<HTMLInputElement>
    checked: boolean
}

interface CheckboxState {

}

export class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
    render() {
        return (
            <input type="checkbox"
                   checked={this.props.checked}
                   onChange={this.props.onChange}
            />
        )
    }
}