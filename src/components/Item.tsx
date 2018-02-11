import * as React from "react";
import {List, ListProps} from "./List";
import { defaultIfNotExists } from "./Helpers";
import {Checkbox} from "./Checkbox";
import {FormEvent} from "react";

export interface ItemProps {
    id?: string,
    label: string,
    list?: ListProps,

    checked?: boolean,
    handleCheckChange?: (checked: boolean) => void,
}

interface ItemState {
    checked: boolean,
}

export class Item extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props);

        this.state = {
            checked: defaultIfNotExists( this.props.checked, false),
        };

        this.handleOwnCheckChange = this.handleOwnCheckChange.bind(this);
        this.handleListCheckChange = this.handleListCheckChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    componentWillReceiveProps(nextProps : ItemProps) {
        if ( nextProps.checked != this.props.checked ) {
            this.setState((currState, nextProps) => {
                return {checked: nextProps.checked};
            });
        }
    }

    /**
     * Updates the state and informs parent about change.
     * @param {boolean} checked Indicates checkbox state.
     */
    checkChange(checked : boolean) : void {
        this.setState({checked: checked});
        this.props.handleCheckChange(checked);
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
        if (this.props.list) {
            let id = defaultIfNotExists(this.props.id, '1');
            let list = defaultIfNotExists(this.props.list, null);

            return (
                <List
                    id={id}
                    {...list}
                    checked={this.state.checked}
                    handleCheckChange={this.handleListCheckChange}
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