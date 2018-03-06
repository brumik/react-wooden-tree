import * as React from 'react';

/**
 * Callback function for CheckboxButton.
 */
export interface CheckboxButtonOnChange {
    (checked: boolean, id: string): void;
}

/**
 * CheckboxButton properties definition.
 */
interface CheckboxButtonProps {
    onChange: (checked: boolean) => void;
    checked: boolean;
    checkedIcon: string;
    partiallyCheckedIcon: string;
    uncheckedIcon: string;
}

/**
 * Creates a checkbox from button. On click event the callback function onChange is fired with the corresponding
 * value (if it was selected then with a false otherwise a true value is passed to the callback.)
 * Using fa-check-square, fa-square-o and fa-square for indicating the sates.
 *
 * @class CheckboxButton
 */
export class CheckboxButton extends React.Component<CheckboxButtonProps, {}> {
    render() {
        let icon: JSX.Element;
        let switchVal: boolean;

        switch (this.props.checked) {
            case false:
                icon = <i className={this.props.uncheckedIcon} />;
                switchVal = true;
                break;
            case undefined:
                icon = <i className={this.props.partiallyCheckedIcon} />;
                switchVal = true;
                break;
            case true:
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
