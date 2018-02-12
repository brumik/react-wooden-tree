import * as React from "react";
import {ItemProps, Item} from "./Item"
import {defVal} from "./Helpers";
import {FormEvent} from "react";
import {CheckboxData} from "./Checkbox";

export interface ListProps {
    id?: string,
    items: ItemProps[],
    checkbox: CheckboxData
}

interface ListState {
}

interface ListVal {
    checkedItemNumber: number,
}

export class List extends React.Component<ListProps, ListState> {
    /**
     * Values which are not displayed therefore no need to store them in state.
     *
     * @type ListVal
     */
    val : ListVal = {
        checkedItemNumber: 0,
    };

    constructor(props: ListProps) {
        super(props);

        this.handleOwnCheckChange = this.handleOwnCheckChange.bind(this);
        this.handleItemCheckChange = this.handleItemCheckChange.bind(this);
    }

    componentWillReceiveProps(nextProps : ItemProps) {
        if ( nextProps.checkbox.checked != this.props.checkbox.checked ) {
            this.val.checkedItemNumber = nextProps.checkbox.checked ? this.props.items.length : 0;
        }
    }


    /**
     * Updates the checked and checkedItemNumber state.
     * If checked the checkedItemNumber will be the max
     * and if not the checkedItemNumber will be zero.
     * @param {boolean} checked Indicates the required checked state.
     */
    checkChange(checked : boolean) : void {
        this.val.checkedItemNumber = (checked ? this.props.items.length : 0);

        if ( this.props.checkbox.checked !== checked)
            this.props.checkbox.onChange(checked);
    }

    /**
     * Item change handler.
     *
     * @param {boolean} checked The list checkbox state.
     */
    handleItemCheckChange(checked : boolean) : void {
        let checkedItemNumber = this.val.checkedItemNumber;

        console.log("ID: " + this.props.id + " " + this.props.checkbox.checked + " and got: " + checked);

        checkedItemNumber += (checked ? 1 : -1);

        console.log(checkedItemNumber);
        if ( checkedItemNumber === this.props.items.length ) {
            this.checkChange(true);
        } else if ( checkedItemNumber === 0 ) {
            this.checkChange(false);
        } else
            this.val.checkedItemNumber = checkedItemNumber;
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
     * Creates a checkbox if not provided with item value then whit own values.
     * Makes sure to passing default value forward.
     *
     * @param {ItemProps} item
     * @returns {CheckboxData}
     */
    defaultCheckbox(item : ItemProps) : CheckboxData {
        let checkbox : CheckboxData = {
            visible: this.props.checkbox.visible,
            checked: this.props.checkbox.checked,
            onChange: this.handleItemCheckChange,
        };

        if ( item.checkbox ) {
            checkbox.visible = defVal(item.checkbox.visible, checkbox.visible);
            // TODO inheritance checked.
        }

        return checkbox;
    }

    /**
     * Renders items in list. Sets default ID of parent if not given to 1.
     *
     * @returns {JSX.Element[]}
     */
    renderItems() : JSX.Element[] {
        let id = defVal(this.props.id, '1');

        return this.props.items.map((item, idx) =>
            (
                <Item key={id + '.' + idx}
                      id={id + '.' + idx}
                      label={item.label}
                      items={item.items}
                      checkbox={this.defaultCheckbox(item)}
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