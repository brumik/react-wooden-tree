import * as React from 'react';

interface ExpandButtonProps {
    onChange: (checked: boolean) => void;
    expanded: boolean;
    loading: boolean; // undefined when error occurred.
    expandIcon: string;
    collapseIcon: string;
    loadingIcon: string;
    errorIcon: string;
}

export interface ExpandButtonOnChange {
    (id: string, opened: boolean): void;
}

export class ExpandButton extends React.Component<ExpandButtonProps, {}> {
    render() {
        let icon: JSX.Element;
        if ( this.props.loading ) {
            icon = <i className={this.props.loadingIcon} />;
        } else if ( this.props.loading === null ) {
            icon = <i className={this.props.errorIcon} />;
        } else if (this.props.expanded) {
            icon = <i className={this.props.collapseIcon} />;
        } else {
            icon = <i className={this.props.expandIcon} />;
        }

        return (
            <button className="ExpandButton" onClick={() => this.props.onChange(!this.props.expanded)}>
                {icon}
            </button>
        );
    }
}
