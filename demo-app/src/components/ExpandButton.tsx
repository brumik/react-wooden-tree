import * as React from 'react';

export interface ExpandButtonProps {
    onChange: (checked: boolean) => void;
    expanded: boolean;
    loading: boolean; // null when error occurred.
    expandIcon: string;
    collapseIcon: string;
    loadingIcon: string;
    errorIcon: string;
}

export interface ExpandButtonOnChange {
    (nodeId: string, opened: boolean): void;
}

export class ExpandButton extends React.Component<ExpandButtonProps, {}> {
    render() {
        let icon: string;
        if ( this.props.loading ) {
            icon = this.props.loadingIcon;
        } else if ( this.props.loading === null ) {
            icon = this.props.errorIcon;
        } else if (this.props.expanded) {
            icon = this.props.collapseIcon;
        } else {
            icon = this.props.expandIcon;
        }

        let cName = icon + ' Icon ExpandButton';

        return (
            <i className={cName} onClick={() => this.props.onChange(!this.props.expanded)} />
        );
    }
}
