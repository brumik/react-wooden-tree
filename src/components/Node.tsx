import * as React from 'react';
import { defVal } from './Helpers';
import { SelectButton, SelectButtonOnChange } from './SelectButton';
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

/**
 * Interface for all data required from the tree root.
 */
export interface ParentData {
    // Checkbox
    checkboxOnChange: SelectButtonOnChange;
    expandOnChange: ExpandButtonOnChange;
    showCheckbox: boolean;

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

    // Styling
    icon?: string;
    image?: string;

    // Private
    parentData?: ParentData;
    initialized?: boolean;

    // TODO All of these
    selectable?: boolean;
    selectedIcon?: string;
    color?: string;
    backColor?: string;
    iconColor?: string;
    classes?: string;
}

/**
 * @class Node
 * @extends React.Component
 *
 * Displays a node and communicates with submodules and tree.
 */
export class Node extends React.Component<NodeProps, {}> {

    /**
     * Initializes the given children nodes.
     *
     * @param {NodeProps[]} children The children to initialize.
     * @param {string} parentID The parent ID to compute children IDs
     * @param {ParentData} parentData The required data from parent.
     * @constructor
     */
    public static ChildrenFactory(children: NodeProps[], parentID: string, parentData: ParentData): void {
        // Check if exists
        if ( children == null ) { return; }

        for (let i = 0; i < children.length; i++) {
            let node = children[i];

            if ( parentID === '' ) {
                node.id = i.toString();
            } else {
                node.id = parentID + '.' + i;
            }

            node.state = Node.StateFactory(node.state);
            node.checkable = defVal(node.checkable, true);
            node.hideCheckbox = defVal(node.hideCheckbox, false);
            node.nodes = defVal(node.nodes, []);

            // Styling
            node.icon = defVal(node.icon, parentData.nodeIcon);
            node.image = defVal(node.image, null);

            // Private
            node.parentData = parentData;
            node.initialized = false;

            // Check if the node is expanded, if so then we have to initialize its children too
            if ( node.state.expanded ) {
                Node.ChildrenFactory(node.nodes, node.id, parentData);
                node.initialized = true;
            }
        }
    }

    /**
     * Creates the Node[] components from given nodes.
     *
     * @param {NodeProps[]} nodes The nodes to render.
     * @returns {JSX.Element[]} The array of JSX elements with nodes.
     */
    public static renderSublist(nodes: NodeProps[]): JSX.Element[] {
        if (nodes) {
            let elements: JSX.Element[] = [];
            for (let i = 0; i < nodes.length; i++) {
                elements.push(
                    <Node
                        key={nodes[i].id}
                        {...nodes[i]}
                    />
                );
            }
            return elements;
        } else { return null; }
    }

    /**
     * Generates a new state from given values or by default all values false.
     *
     * @param {NodeState} state The already existing state. Top priority value.
     * @returns {NodeState} The new filled state (if no value in the node then default)
     * @constructor
     */
    private static StateFactory(state: NodeState): NodeState {
        if ( state != null) {
            return {
                checked: defVal(state.checked, false),
                disabled: defVal(state.disabled, false),
                expanded: defVal(state.expanded, false),
                selected: defVal(state.selected, false)
            };
        } else {
            return {checked: false, disabled: false, expanded: false, selected: false};
        }
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
            <SelectButton
                onChange={this.handleCheckChange}
                checked={this.props.state.checked}
                checkedIcon={this.props.parentData.checkedIcon}
                partiallyCheckedIcon={this.props.parentData.partiallyCheckedIcon}
                uncheckedIcon={this.props.parentData.uncheckedIcon}
            />
        ) : null;

        // Dropdown button if not displayed added padding
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
            } else {
                icon = <i className={this.props.icon}/>;
            }
        }

        // Children
        const sublist = this.props.state.expanded ? (
            Node.renderSublist(this.props.nodes)
        ) : null;

        return (
            <React.Fragment>
                <li className={NodeClasses}>
                    {openButton}
                    {checkbox}
                    {icon}
                    {this.props.text}
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
     * Returns the computed padding size for the current list item for indent.
     * @returns {number} The computed padding level.
     */
    private getItemIndentSize(): number {
        return (this.props.id.split('.').length - 1);
    }
}
