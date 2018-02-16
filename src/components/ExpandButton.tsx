import * as React from "react";
import FaAngleDown = require("react-icons/lib/fa/angle-down");
import FaAngleRight = require("react-icons/lib/fa/angle-right");


interface ExpandButtonProps {
    onChange: (checked : boolean) => void,
    expanded: boolean,
}

interface ExpandButtonOnChange {
    (id: string, opened: boolean) : void
}

export interface ExpandButtonData {
    expanded: boolean,
    onChange: ExpandButtonOnChange
}

export function ExpandButtonDataFactory(expanded: boolean, onChange: ExpandButtonOnChange) : ExpandButtonData {
    return {expanded: expanded, onChange: onChange}
}

export class ExpandButton extends React.Component<ExpandButtonProps, {}> {
    render() {
        let icon : JSX.Element;
        if (this.props.expanded) {
            icon = <FaAngleDown/>;
        } else {
            icon = <FaAngleRight/>
        }

        return (
            <button className="ExpandButton" onClick={() => this.props.onChange(!this.props.expanded)}>
                {icon}
            </button>
        );
    }
}
