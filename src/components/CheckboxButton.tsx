import * as React from 'react';
import { Checkbox, CheckboxButtonProps } from './types';

/**
 * Creates a checkbox from button. On click event the callback function onChange is fired with the corresponding
 * value (if it was selected then with a false otherwise a true value is passed to the callback.)
 * Using fa-check-square, fa-square-o and fa-square for indicating the sates.
 *
 * @class CheckboxButton
 */
export class CheckboxButton extends React.Component<CheckboxButtonProps, {}> {
    render() {
        let icon: string;
        let switchVal: boolean;

        switch (this.props.checked) {
            case Checkbox.UNCHECKED:
                icon = this.props.uncheckedIcon;
                switchVal = true;
                break;
            case Checkbox.PARTIALLY:
                icon = this.props.partiallyCheckedIcon;
                switchVal = true;
                break;
            case Checkbox.CHECKED:
                icon = this.props.checkedIcon;
                switchVal = false;
                break;
            default:
                icon = 'fa fa-question-circle';
        }

        let cName = icon + ' icon checkbox-button';

        return (
            <i className={cName} onClick={() => this.props.onChange(switchVal)} />
        );
    }
}
