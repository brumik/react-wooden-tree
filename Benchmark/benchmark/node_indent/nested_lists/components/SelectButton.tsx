import * as React from 'react';

/**
 * Callback function for CheckboxButton.
 */
interface SelectButtonOnChange {
    (checked: boolean, id: string): void;
}

/**
 * The sate of checked values.
 */
export enum SelectButtonState {
    Unselected = -1, PartiallySelected = 0, Selected = 1,
}

/**
 * The interface which is used to store all required data for a CheckboxButton.
 *
 */
export interface SelectButtonData {
    checked?: SelectButtonState;
    onChange?: SelectButtonOnChange;
}

/**
 * Generates the button data from given values.
 *
 * @param {boolean} checked The already defined select button data on element. Used if available.
 * @param {SelectButtonOnChange} onChange The callback function on change.
 * Usually uses parent's function (passing recursively the root's function)
 * @returns {SelectButtonData} The new SelectButtonData.
 * @constructor
 */
export function SelectButtonDataFactory(checked: boolean, onChange: SelectButtonOnChange): SelectButtonData {
    return {
        checked: checked ? SelectButtonState.Selected : SelectButtonState.Unselected,
        onChange: onChange,
    };
}

/**
 * CheckboxButton properties definition.
 */
interface SelectButtonProps {
    onChange: (checked: boolean) => void;
    checked: SelectButtonState;
}

/**
 * Creates a checkbox from button. On click event the callback function onChange is fired with the corresponding
 * value (if it was selected then with a false otherwise a true value is passed to the callback.)
 * Using fa-check-square, fa-square-o and fa-square for indicating the sates.
 *
 * @class CheckboxButton
 */
export class SelectButton extends React.Component<SelectButtonProps, {}> {
    render() {
        let icon: JSX.Element;
        let switchVal: boolean;

        switch (this.props.checked) {
            case SelectButtonState.Unselected:
                icon = <i className="fa fa-square-o" />;
                switchVal = true;
                break;
            case SelectButtonState.PartiallySelected:
                icon = <i className="fa fa-square" />;
                switchVal = true;
                break;
            case SelectButtonState.Selected:
                icon = <i className="fa fa-check-square" />;
                switchVal = false;
                break;
            default:
                icon = <i className="fa fa-question-circle" />;
        }

        return (
            <button className="SelectButton" onClick={() => this.props.onChange(switchVal)}>
                    {icon}
            </button>
        );
    }
}
