import * as React from 'react';
import { CheckboxButton, CheckboxButtonOnChange } from './CheckboxButton';
import { ExpandButton, ExpandButtonOnChange } from './ExpandButton';

/**
 * Interface for the node's state property.
 */
export interface NodeState {
    checked?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
}

export interface SelectOnChange {
    (nodeId: string, selected: boolean): void;
}

export interface OnLazyLoad {
    (nodeId: string): void;
}

/**
 * Interface for all data required from the tree root.
 */
export interface ParentData {
    // Callbacks
    checkboxOnChange: CheckboxButtonOnChange;
    expandOnChange: ExpandButtonOnChange;
    selectOnChange: SelectOnChange;
    onLazyLoad: OnLazyLoad;
    showCheckbox: boolean;
    initSelectedNode: (nodeId: string) => void;

    // Icons
    showIcon: boolean;                 // < Determines if the icons are showed in nodes.
    showImage: boolean;                // < Determines if images are preferred to the icons.
    nodeIcon: string;                  // < Default icon for nodes without it.
    checkedIcon: string;               // < The checkbox-checked icon.
    uncheckedIcon: string;             // < The checkbox-unchecked icon.
    partiallyCheckedIcon: string;      // < The checkbox-partially selected icon.
    collapseIcon: string;              // < The icon for collapsing parents.
    expandIcon: string;                // < The icon for expanding parents.
    loadingIcon: string;               // < The loading icon when loading data with ajax.
    errorIcon: string;                 // < The icon displayed when lazyLoading went wrong.
    selectedIcon: string;              // < The icon for selected nodes.

    // Styling
    changedCheckboxClass: string;      // < Extra class for the changed checkbox nodes.
    selectedClass: string;             // < Extra class for the selected nodes.

    // Other
    checkboxFirst: boolean;            // < Determines the order of the icon and the checkbox.
}

/**
 * Node properties interface.
 */
export interface NodeProps {
    nodeId?: string;
    text: string;
    nodes?: NodeProps[];
    state?: NodeState;

    checkable?: boolean;
    hideCheckbox?: boolean;

    selectable?: boolean;
    selectedIcon?: string;

    lazyLoad?: boolean;
    loading?: boolean; // Null when error occurred

    attr?: {[key: string]: string};

    // Styling
    icon?: string;
    iconColor?: string;
    iconBackground?: string;
    image?: string;
    classes?: string;

    // Private
    parentData?: ParentData;
}

/**
 * @class Node
 * @extends React.Component
 *
 * Displays a node and communicates with submodules and tree.
 */
export class Node extends React.Component<NodeProps, {}> {
    /**
     * Used for default values.
     */
    public static defaultProps: NodeProps;

    /**
     * Used for determining if checkbox has changed.
     */
    private readonly defaultCheckbox: boolean;

    /**
     * Creates the Node[] components from given nodes.
     *
     * @param {NodeProps[]} nodes The nodes to render.
     * @param {ParentData} parentData The parent data to pass.
     * @returns {JSX.Element[]} The array of JSX elements with nodes.
     */
    public static renderSublist(nodes: NodeProps[], parentData: ParentData): JSX.Element[] {
        if (nodes) {
            let elements: JSX.Element[] = [];
            for (let i = 0; i < nodes.length; i++) {
                elements.push(
                    <Node
                        key={nodes[i].nodeId}
                        parentData={parentData}
                        {...nodes[i]}
                    />
                );
            }
            return elements;
        } else { return null; }
    }

    /**
     * Renders the tree element.
     *
     * @returns {JSX.Element}
     */
    public render () {
        // Indent class
        let NodeClasses = 'indent-' + this.getItemIndentSize();

        // Checkbox
        const checkbox = !this.props.hideCheckbox && this.props.parentData.showCheckbox ? (
            <CheckboxButton
                onChange={this.handleCheckChange}
                checked={this.props.state.checked}
                checkedIcon={this.props.parentData.checkedIcon}
                partiallyCheckedIcon={this.props.parentData.partiallyCheckedIcon}
                uncheckedIcon={this.props.parentData.uncheckedIcon}
            />
        ) : null;

        // Expand button: if not displayed added padding
        let openButton: JSX.Element;
        if ( ( this.props.nodes && this.props.nodes.length > 0 ) || this.props.lazyLoad ) {
            openButton = (
                <ExpandButton
                    onChange={this.handleOpenChange}
                    expanded={this.props.state.expanded}
                    loading={this.props.loading}
                    expandIcon={this.props.parentData.expandIcon}
                    collapseIcon={this.props.parentData.collapseIcon}
                    loadingIcon={this.props.parentData.loadingIcon}
                    errorIcon={this.props.parentData.errorIcon}
                />
            );
        } else {
            openButton = null;
            NodeClasses += ' NoOpenButton';
        }

        // Icon
        let icon: JSX.Element = null;
        if ( this.props.parentData.showIcon ) {

            let iconStyle: {color?: string, backgroundColor?: string} = {};

            if ( this.props.iconColor ) {
                iconStyle.color = this.props.iconColor;
            }

            if ( this.props.iconBackground ) {
                iconStyle.backgroundColor = this.props.iconBackground;
            }

            if ( this.props.parentData.showImage && this.props.image ) {
                icon = <img className={'NodeIconImage'} src={this.props.image}/>;
            } else if ( this.props.icon ) {
                icon = <i className={'Icon ' + this.props.icon} style={iconStyle}/>;
            } else {
                icon = <i className={'Icon ' + this.props.parentData.nodeIcon} style={iconStyle}/>;
            }
        }

        // Selected
        let selectedIcon: JSX.Element = null;
        if ( this.props.state.selected ) {
            if ( this.props.selectedIcon ) {
                selectedIcon = <i className={this.props.selectedIcon}/>;
            } else {
                selectedIcon = <i className={this.props.parentData.selectedIcon}/>;
            }
        }

        // Selectable class
        if ( this.props.selectable && !this.props.state.disabled ) {
            NodeClasses += ' Selectable';
        }

        // Children
        const sublist = this.props.state.expanded ? (
            Node.renderSublist(this.props.nodes, this.props.parentData)
        ) : null;

        // Determining icon order
        let icon1, icon2: JSX.Element;
        if ( this.props.parentData.checkboxFirst ) {
            icon1 = checkbox;
            icon2 = icon;
        } else {
            icon1 = icon;
            icon2 = checkbox;
        }

        // Additional classes
        if ( this.props.classes ) {
            NodeClasses += ' ' + this.props.classes;
        }
        // Changed checkbox class
        if ( this.props.state.checked !== this.defaultCheckbox ) {
            NodeClasses += ' ' + this.props.parentData.changedCheckboxClass;
        }
        // Selected class
        if ( this.props.state.selected ) {
            NodeClasses += ' ' + this.props.parentData.selectedClass;
        }

        // Data Attributes list
        let DataAttr: {[k: string]: string} = {'data-id': this.props.nodeId};

        return (
            <React.Fragment>
                <li className={NodeClasses} {...DataAttr} {...this.props.attr}>
                    {openButton}
                    {icon1}
                    {selectedIcon}
                    {icon2}
                    {/* TODO Somehow remove span but prevent change if clicked on expand or check button */}
                    <span onClick={this.handleSelected}>{this.props.text}</span>
                </li>
                {sublist}
            </React.Fragment>
        );
    }

    /**
     * Constructor.
     * @param {NodeProps} props
     */
    private constructor(props: NodeProps) {
        super(props);

        if ( this.props.state.selected ) {
            this.props.parentData.initSelectedNode(this.props.nodeId);
        }

        this.defaultCheckbox = this.props.state.checked;

        this.handleSelected = this.handleSelected.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
    }

    /**
     * Own checkbox handler.
     * @param {boolean} checked Contains the input field value.
     */
    private handleCheckChange(checked: boolean): void {
        if ( this.props.checkable && !this.props.state.disabled ) {
            this.props.parentData.checkboxOnChange(checked, this.props.nodeId);
        }
    }

    /**
     * Handles open event.
     * If lazy load set then loads the child nodes too.
     *
     * @param {boolean} expanded True on expand false on collapse.
     */
    private handleOpenChange(expanded: boolean): void {
        if ( this.props.lazyLoad && this.props.nodes === null ) {
            this.props.parentData.onLazyLoad(this.props.nodeId);
        }

        this.props.parentData.expandOnChange(this.props.nodeId, expanded);
    }

    /**
     * Handles the selected event. If allowed to select then calls the callback
     * function with the opposite of currently selected state.
     */
    private handleSelected(): void {
        if ( this.props.selectable && !this.props.state.disabled ) {
            this.props.parentData.selectOnChange(this.props.nodeId, !this.props.state.selected);
        }
    }

    /**
     * Returns the computed padding size for the current list item for indent.
     * @returns {number} The computed padding level.
     */
    private getItemIndentSize(): number {
        return (this.props.nodeId.split('.').length - 1);
    }
}

/**
 * Node default values.
 */
Node.defaultProps = {
    nodeId: '',
    text: '',
    nodes: null,
    state: {
        checked: false,
        expanded: false,
        disabled: false,
        selected: false
    },

    checkable: true,
    hideCheckbox: false,
    selectable: true,
    selectedIcon: null,
    lazyLoad: false,
    loading: false,

    attr: null,

    // Styling
    icon: null,
    iconColor: null,
    iconBackground: null,
    image: null,
    classes: '',

    // Private
    parentData: null,
};