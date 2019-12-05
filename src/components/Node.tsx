import * as React from 'react';
import { NodeProps, ParentDataType } from '..';
import { CheckboxButton } from './CheckboxButton';
import { ExpandButton } from './ExpandButton';
import { ParentDataContext } from './Tree';

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
    public static renderSublist(nodeIds: string[], { connectedNode, tree }: ParentDataType): JSX.Element[] {
        let elements: JSX.Element[] = [];
        if ( connectedNode ) {
            const ConnectedNode = connectedNode;
            for (let i = 0; i < nodeIds.length; i++) {
                elements.push(
                    <ConnectedNode
                        key={nodeIds[i]}
                        nodeId={nodeIds[i]}
                    />
                );
            }
        } else {
            for (let i = 0; i < nodeIds.length; i++) {
                elements.push(
                    <Node
                        key={nodeIds[i]}
                        nodeId={nodeIds[i]}
                        {...tree[nodeIds[i]]}
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
    public render (): JSX.Element {
        // Indent class
        let NodeClasses = 'indent-' + this.getItemIndentSize();

        // Checkbox
        const checkbox = !this.props.hideCheckbox && this.context.showCheckbox ? (
            <CheckboxButton
                onChange={this.handleCheckChange}
                checked={this.props.state.checked}
                checkedIcon={this.context.checkedIcon}
                partiallyCheckedIcon={this.context.partiallyCheckedIcon}
                uncheckedIcon={this.context.uncheckedIcon}
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
                    expandIcon={this.context.expandIcon}
                    collapseIcon={this.context.collapseIcon}
                    loadingIcon={this.context.loadingIcon}
                    errorIcon={this.context.errorIcon}
                />
            );
        } else {
            openButton = null;
            NodeClasses += ' no-open-button';
        }

        // Icon
        let icon: JSX.Element = null;
        if ( this.context.showIcon ) {

            let iconStyle: {color?: string, backgroundColor?: string} = {};

            if ( this.props.iconColor ) {
                iconStyle.color = this.props.iconColor;
            }

            if ( this.props.iconBackground ) {
                iconStyle.backgroundColor = this.props.iconBackground;
            }

            if ( this.context.showImage && this.props.image ) {
                icon = <img className={'icon image'} src={this.props.image}/>;
            } else if ( this.props.icon ) {
                icon = <i className={'icon ' + this.props.icon} style={iconStyle}/>;
            } else {
                icon = <i className={'icon ' + this.context.nodeIcon} style={iconStyle}/>;
            }
        }

        // Selected
        let selectedIcon: JSX.Element = null;
        if ( this.props.state.selected ) {
            if ( this.props.selectedIcon ) {
                selectedIcon = <i className={this.props.selectedIcon}/>;
            } else {
                selectedIcon = <i className={this.context.selectedIcon}/>;
            }
        }

        // Selectable class
        if ( this.props.selectable && !this.props.state.disabled ) {
            NodeClasses += ' selectable';
        }

        // Children
        const sublist = this.props.state.expanded ? (
            Node.renderSublist(this.props.nodes, this.context)
        ) : null;

        // Determining icon order
        let icon1, icon2: JSX.Element;
        if ( this.context.checkboxFirst ) {
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
            NodeClasses += ' ' + this.context.changedCheckboxClass;
        }
        // Selected class
        if ( this.props.state.selected ) {
            NodeClasses += ' ' + this.context.selectedClass;
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
                    <span onClick={this.handleSelected} dangerouslySetInnerHTML={{ __html: this.props.text }} />
                </li>
                {sublist}
            </React.Fragment>
        );
    }

    /**
     * Constructor.
     * @param {NodeProps} props
     */
     public constructor(props: NodeProps, context: ParentDataType) {
        super(props, context);

        if ( this.props.state.selected ) {
            this.context.initSelectedNode(this.props.nodeId);
        }

        this.defaultCheckbox = this.props.state.checked;
    }

    /**
     * Own checkbox handler.
     * @param {boolean} checked Contains the input field value.
     */
    private handleCheckChange = (checked: boolean): void => {
        if ( this.props.checkable && !this.props.state.disabled ) {
            this.context.checkboxOnChange(checked, this.props.nodeId);
        }
    }

    /**
     * Handles open event.
     * If lazy load set then loads the child nodes too.
     *
     * @param {boolean} expanded True on expand false on collapse.
     */
    private handleOpenChange = (expanded: boolean): void => {
        if ( this.props.lazyLoad && this.props.nodes.length < 1 ) {
            this.context.onLazyLoad(this.props.nodeId);
        } else {
            this.context.expandOnChange(this.props.nodeId, expanded);
        }
    }

    /**
     * Handles the selected event. If allowed to select then calls the callback
     * function with the opposite of currently selected state.
     *
     * If select is disabled on the node then it works like expand.
     */
    private handleSelected = (): void => {
        if ( this.props.selectable && !this.props.state.disabled ) {
            this.context.selectOnChange(this.props.nodeId, !this.props.state.selected);
        } else {
            this.handleOpenChange(!this.props.state.expanded);
        }
    }

    /**
     * Returns the computed padding size for the current list item for indent.
     * @returns {number} The computed padding level.
     */
    private getItemIndentSize = (): number => this.props.nodeId.split('.').length - 1;
}

Node.contextType = ParentDataContext;

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
};
