import * as React from "react";
import {ItemProps, Item} from "./Item"
import {Checkbox} from "./Checkbox";
import {defaultIfNotExists} from "./Helpers";
import {FormEvent} from "react";
import {FormEventHandler} from "react";

export interface ListProps {
    id?: string,
    items: ItemProps[],

    checked?: boolean,
    handleCheckChange?: (checked: boolean) => void,
}

interface ListState {
    checkedItemNumber: number,
}

export class List extends React.Component<ListProps, ListState> {
    constructor(props: ListProps) {
        super(props);

        this.state = {
            checkedItemNumber: 0,
        };

        this.handleOwnCheckChange = this.handleOwnCheckChange.bind(this);
        this.handleItemCheckChange = this.handleItemCheckChange.bind(this);
    }

    /**
     * Updates the checked and checkedItemNumber state.
     * If checked the checkedItemNumber will be the max
     * and if not the checkedItemNumber will be zero.
     * @param {boolean} checked Indicates the required checked state.
     */
    checkChange(checked : boolean) : void {
        this.setState({checkedItemNumber: (checked ? this.props.items.length : 0)});

        this.props.handleCheckChange(checked);
    }

    /**
     * Item change handler.
     * @param {boolean} checked The list checkbox state.
     */
    handleItemCheckChange(checked : boolean) : void {
        let checkedItemNumber = this.state.checkedItemNumber + (checked ? 1 : -1);

        if ( checkedItemNumber === this.props.items.length ) {
            this.checkChange(true);
        } else
            this.setState({checkedItemNumber: checkedItemNumber});
    }

    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    handleOwnCheckChange(event : FormEvent<HTMLInputElement>) : void {
        const target = event.target as HTMLInputElement;
        this.checkChange(target.checked);
    }

    /**
     * Renders items in list. Sets default ID of parent if not given to 1.
     *
     * @returns {JSX.Element[]}
     */
    renderItems() : JSX.Element[] {
        let id = defaultIfNotExists(this.props.id, '1');

        return this.props.items.map((item, idx) =>
            (
                <Item key={id + '.' + idx}
                      id={id + '.' + idx}
                      {...item}
                      checked={this.props.checked}
                      handleCheckChange={this.handleItemCheckChange}
                />
            )
        );
    }

    render() {
        return (
            <ul>
                {this.renderItems()}
            </ul>
        )
    }
}