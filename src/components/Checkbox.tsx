import * as React from "react";
import {FormEventHandler} from "react";
import {defVal} from "./Helpers";

export interface CheckboxOnChange {
    (checked: boolean, id : string) : void
}

export interface CheckboxData {
    visible: boolean,
    checked: boolean,
    onChange: CheckboxOnChange,
    childrenCheckedCount: number,
}

export function CheckboxDataFactory(checkbox : CheckboxData, onChange : CheckboxOnChange) : CheckboxData {
    if ( checkbox != null )
        return {
            visible: defVal(checkbox.visible, false),
            checked: defVal(checkbox.checked, false),
            onChange: onChange,
            childrenCheckedCount: 0
        };
    else return {visible: false, checked: false, onChange: onChange, childrenCheckedCount: 0};
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