import * as React from 'react';
import { ExpandButtonProps } from './types';

export class ExpandButton extends React.Component<ExpandButtonProps, {}> {
    render() {
        let icon: string;
        if ( this.props.loading ) {
            icon = this.props.loadingIcon;
        } else if ( this.props.loading === null ) {
            icon = this.props.errorIcon;
        } else if ( this.props.expanded ) {
            icon = this.props.collapseIcon;
        } else {
            icon = this.props.expandIcon;
        }

        let cName = icon + ' icon expand-button';

        return (
            <i className={cName} onClick={() => this.props.onChange(!this.props.expanded)} />
        );
    }
}
