import * as React from 'react';

/**
 * Callback function for SelectButton.
 */
export interface SelectButtonOnChange {
    (checked: boolean, id: string): void;
}

/**
 * The sate of checked values.
 */
export enum SelectButtonState {
    Unselected = -1, PartiallySelected = 0, Selected = 1,
}

/**
 * SelectButton properties definition.
 */
interface SelectButtonProps {
    onChange: (checked: boolean) => void;
    checked: SelectButtonState;
    checkedIcon: string;
    partiallyCheckedIcon: string;
    uncheckedIcon: string;
}

/**
 * Creates a checkbox from button. On click event the callback function onChange is fired with the corresponding
 * value (if it was selected then with a false otherwise a true value is passed to the callback.)
 * Using fa-check-square, fa-square-o and fa-square for indicating the sates.
 *
 * @class SelectButton
 */
export class SelectButton extends React.Component<SelectButtonProps, {}> {
    render() {
        let icon: JSX.Element;
        let switchVal: boolean;

        switch (this.props.checked) {
            case SelectButtonState.Unselected:
                icon = <i className={this.props.uncheckedIcon} />;
                switchVal = true;
                break;
            case SelectButtonState.PartiallySelected:
                icon = <i className={this.props.partiallyCheckedIcon} />;
                switchVal = true;
                break;
            case SelectButtonState.Selected:
                icon = <i className={this.props.checkedIcon} />;
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
