import * as React from "react";
import {List} from "./List";
import { defVal } from "./Helpers";
import {Checkbox, CheckboxData} from "./Checkbox";
import {FormEvent} from "react";

export interface ItemProps {
    id: string,
    label: string,
    items: ItemProps[],
    checkbox: CheckboxData,
    opened: boolean,
}

interface ItemState {
    checked: boolean,
    opened: boolean,
}

export class Item extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);

        this.state = {
            checked: this.props.checkbox.checked,
            opened: this.props.opened,
        };

        this.handleOwnCheckChange = this.handleOwnCheckChange.bind(this);
        this.handleListCheckChange = this.handleListCheckChange.bind(this);
    }

    /**
     * When receiving new props updates:
     * checked: If parent changes children should reflect it.
     *
     * @param {ItemProps} nextProps
     */
    componentWillReceiveProps(nextProps : ItemProps) {
        if ( nextProps.checkbox.checked != this.props.checkbox.checked ) {
            this.setState((currState, nextProps) => {
                return {checked: nextProps.checkbox.checked};
            });
        }
    }

    /**
     * Updates the state and informs parent about change.
     * @param {boolean} checked Indicates checkbox state.
     */
    checkChange(checked : boolean) : void {
        this.setState({checked: checked});
        this.props.checkbox.onChange(checked);
    }

    /**
     * List change handler.
     * @param {boolean} checked The list checkbox state.
     */
    handleListCheckChange(checked : boolean) : void {
        this.checkChange(checked);
    }

    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    handleOwnCheckChange(event : FormEvent<HTMLInputElement>) : void {
        const target = event.target as HTMLInputElement;
        this.checkChange(target.checked);
    }

    renderSublist() : JSX.Element {
        console.log("ID: " + this.props.id + " - opened: " + this.state.opened);

        if (this.props.items && this.state.opened) {
            let id = defVal(this.props.id, '1');

            return (
                <List
                    id={id}
                    items={this.props.items}
                    checkbox={{
                        visible: this.props.checkbox.visible,
                        checked: this.state.checked,
                        onChange: this.handleListCheckChange
                    }}
                />
            );
        } else return null;
    }

    render () {
        return (
            <li>
                <Checkbox onChange={this.handleOwnCheckChange} checked={this.state.checked}/>
                {this.props.label}
                {this.renderSublist()}
            </li>
        )
    }
}