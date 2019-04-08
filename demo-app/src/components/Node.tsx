import * as React from 'react';
import {
    CheckboxButton,
    ExpandButton, NodeProps, ParentDataType,
} from '../internal';

/**
 * @class Node
 * @extends React.Component
 *
 * Displays a node and communicates with submodules and tree.
 */
export class Node extends React.PureComponent<NodeProps, {}> {
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
     * @param {string[]} nodeIds The nodes to render.
     * @param {ParentDataType} parentData The parent data to pass.
     * @returns {JSX.Element[]} The array of JSX elements with nodes.
     */
    public static renderSublist(nodeIds: string[], parentData: ParentDataType): JSX.Element[] {
        let elements: JSX.Element[] = [];
        if ( parentData.connectedNode ) {
            const ConnectedNode = parentData.connectedNode;
            for (let i = 0; i < nodeIds.length; i++) {
                elements.push(
                    <ConnectedNode
                        key={nodeIds[i]}
                        parentData={parentData}
                        nodeId={nodeIds[i]}
                    />
                );
            }
        } else {
            for (let i = 0; i < nodeIds.length; i++) {
                elements.push(
                    <Node
                        key={nodeIds[i]}
                        parentData={parentData}
                        nodeId={nodeIds[i]}
                        {...parentData.tree[nodeIds[i]]}
                    />
                );
            }
        }
        return elements;
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
     public constructor(props: NodeProps) {
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
        if ( this.props.lazyLoad && this.props.nodes.length < 1 ) {
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
    nodes: [],
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
