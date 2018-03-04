import * as React from 'react';
import { CheckboxButton, CheckboxButtonOnChange } from './CheckboxButton';
import { ExpandButton, ExpandButtonOnChange } from './ExpandButton';

/**
 * Interface for the node's state property.
 */
interface NodeState {
    checked?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
}

interface SelectOnChange {
    (id: string, selected: boolean): void;
}

/**
 * Interface for all data required from the tree root.
 */
export interface ParentData {
    // Callbacks
    checkboxOnChange: CheckboxButtonOnChange;
    expandOnChange: ExpandButtonOnChange;
    selectOnChange: SelectOnChange;
    showCheckbox: boolean;
    initSelectedNode: (id: string) => void;

    // Icons
    showIcon?: boolean;                 // < Determines if the icons are showed in nodes.
    showImage?: boolean;                // < Determines if images are preferred to the icons.
    nodeIcon?: string;                  // < Default icon for nodes without it.
    checkedIcon?: string;               // < The checkbox-checked icon.
    uncheckedIcon?: string;             // < The checkbox-unchecked icon.
    partiallyCheckedIcon?: string;      // < The checkbox-partially selected icon.
    collapseIcon?: string;              // < The icon for collapsing parents.
    expandIcon?: string;                // < The icon for expanding parents.
    emptyIcon?: string;                 // < TODO: The icon for empty something.
    loadingIcon?: string;               // < TODO: The loading icon when loading data with ajax.
    selectedIcon?: string;              // < TODO: The icon for selected nodes.

    // Other
    checkboxFirst: boolean;             // < Determines the order of the icon and the checkbox.
}

/**
 * Node properties interface.
 */
export interface NodeProps {
    id?: string;
    text: string;
    nodes?: NodeProps[];
    state?: NodeState;

    checkable?: boolean;
    hideCheckbox?: boolean;

    selectable?: boolean;
    selectedIcon?: string;

    classes?: string;

    // Styling
    icon?: string;
    image?: string;

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
                        key={nodes[i].id}
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
        if ( this.props.nodes.length > 0 ) {
            openButton = (
                <ExpandButton
                    onChange={this.handleOpenChange}
                    expanded={this.props.state.expanded}
                    expandIcon={this.props.parentData.expandIcon}
                    collapseIcon={this.props.parentData.collapseIcon}
                />
            );
        } else {
            openButton = null;
            NodeClasses += ' NoOpenButton';
        }

        // Icon
        let icon: JSX.Element = null;
        if ( this.props.parentData.showIcon ) {
            if ( this.props.parentData.showImage && this.props.image ) {
                icon = <img className={'NodeIconImage'} src={this.props.image}/>;
            } else if ( this.props.icon ) {
                icon = <i className={this.props.icon}/>;
            } else {
                icon = <i className={this.props.parentData.nodeIcon}/>;
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

        return (
            <React.Fragment>
                <li className={NodeClasses} id={this.props.id}>
                    {openButton}
                    {icon1}
                    {selectedIcon}
                    {icon2}
                    {/* TODO Somehow remove span but prevent change if clicked on expand or chekc button */}
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
            this.props.parentData.initSelectedNode(this.props.id);
        }

        this.handleSelected = this.handleSelected.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
    }

    /**
     * Own checkbox handler.
     * @param {boolean} checked Contains the input field value.
     */
    private handleCheckChange(checked: boolean): void {
        if ( this.props.checkable ) {
            this.props.parentData.checkboxOnChange(checked, this.props.id);
        }
    }

    /**
     * Handles open event.
     * @param {boolean} expanded True on expand false on collapse.
     */
    private handleOpenChange(expanded: boolean): void {
        this.props.parentData.expandOnChange(this.props.id, expanded);
    }

    /**
     * Handles the selected event. If allowed to select then calls the callback
     * function with the opposite of currently selected state.
     */
    private handleSelected(): void {
        if ( this.props.selectable && !this.props.state.disabled ) {
            this.props.parentData.selectOnChange(this.props.id, !this.props.state.selected);
        }
    }

    /**
     * Returns the computed padding size for the current list item for indent.
     * @returns {number} The computed padding level.
     */
    private getItemIndentSize(): number {
        return (this.props.id.split('.').length - 1);
    }
}

/**
 * Node default values.
 */
Node.defaultProps = {
    id: '',
    text: '',
    nodes: [],
    state: {
        checked: false,
        expanded: false,
        disabled: false,
        selected: false
    },

    checkable: true,
    hideCheckbox: false,

    // Styling
    icon: null,
    image: null,

    // Private
    parentData: null,

    // TODO All of these
    selectable: true,
    selectedIcon: null,
    classes: ''
};