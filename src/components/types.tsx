import * as React from 'react';

/**
 * The props interface for the tree component.
 */
export interface TreeProps {
    /** The definitions of the tree nodes. */
    data?: TreeDataType;

    // Checkbox
    /** Option: whenever the checkboxes are displayed. */
    showCheckbox?: boolean;
    /** If enabled parent and children are reflecting each other changes. */
    hierarchicalCheck?: boolean;
    /** Determines if the node icon or the checkbox is the first. */
    checkboxFirst?: boolean;

    // Selection
    /** Determines if multiple nodes can be selected. */
    multiSelect?: boolean;
    /** Determines if can be deselected all nodes. */
    preventDeselect?: boolean;
    /** Used with preventDeselect allows to fire selected event on selected node. */
    allowReselect?: boolean;

    // Icons
    /** Determines if the icons are showed in nodes. */
    showIcon?: boolean;
    /** Determines if images are preferred to the icons. */
    showImage?: boolean;
    /** Default icon for nodes without it. */
    nodeIcon?: string;
    /** The checkbox-checked icon. */
    checkedIcon?: string;
    /** The checkbox-unchecked icon. */
    uncheckedIcon?: string;
    /** The checkbox-partially selected icon. */
    partiallyCheckedIcon?: string;
    /** The icon for collapsing parents. */
    collapseIcon?: string;
    /** The icon for expanding parents. */
    expandIcon?: string;
    /** The loading icon when loading data with ajax. */
    loadingIcon?: string;
    /** The icon displayed when lazyLoading went wrong. */
    errorIcon?: string;
    /** The icon for selected nodes. */
    selectedIcon?: string

    // Styling
    /** Extra class for the changed checkbox nodes. */
    changedCheckboxClass?: string;
    /** Extra class for the selected nodes. */
    selectedClass?: string;

    // Other
    /** Determines which version to use (redux or non) */
    connectedNode?: React.ComponentType<NodeProps>;

    callbacks: {
        // Callbacks
        /**
         * All changes made in the tree will be propagated upwards.
         * Every time the tree changes the node's data the callback will be fired.
         *
         * @param commands Array of commands: [nodeId, type, value].
         */
        onDataChange: (commands: CommandQueueType[]) => void;

        /**
         * The function which will be called when a lazily loadable node is
         * expanded first time.
         *
         * @param {NodeProps} node The node of the node which has to be loaded.
         * @returns {Promise<NodeProps[]>} Promise about the children of the given node.
         */
        lazyLoad?: (node: NodeProps) => Promise<TreeDataType>;
    };
}

/**
 * Interface for all data required from the tree root.
 */
export interface ParentDataType {
    // Non redux
    tree: TreeDataType;

    // Callbacks
    checkboxOnChange: CheckboxButtonOnChangeType;
    expandOnChange: ExpandButtonOnChangeType;
    selectOnChange: (nodeId: string, selected: boolean) => void;
    onLazyLoad: (nodeId: string) => void;
    showCheckbox: boolean;
    initSelectedNode: (nodeId: string) => void;

    // Icons
    /** Determines if the icons are showed in nodes. */
    showIcon: boolean;
    /** Determines if images are preferred to the icons. */
    showImage: boolean;
    /** Default icon for nodes without it. */
    nodeIcon: string;
    /** The checkbox-checked icon. */
    checkedIcon: string;
    /** The checkbox-unchecked icon. */
    uncheckedIcon: string;
    /** The checkbox-partially selected icon. */
    partiallyCheckedIcon: string;
    /** The icon for collapsing parents. */
    collapseIcon: string;
    /** The icon for expanding parents. */
    expandIcon: string;
    /** The loading icon when loading data with ajax. */
    loadingIcon: string;
    /** The icon displayed when lazyLoading went wrong. */
    errorIcon: string;
    /** The icon for selected nodes. */
    selectedIcon: string;

    // Styling
    /** Extra class for the changed checkbox nodes. */
    changedCheckboxClass: string;
    /** Extra class for the selected nodes. */
    selectedClass: string;

    // Other
    /** Determines the order of the icon and the checkbox. */
    checkboxFirst: boolean;
    /** Determines if it should use the redux or the non redux version. */
    connectedNode: React.ComponentType<NodeProps>;
}

/**
 * The bone of the old structure. Used when converting to the new.
 */
export interface HierarchicalNodeProps {
    nodeId?: string;
    nodes?: HierarchicalNodeProps[];
    [propTypes: string]: any;
}

/**
 * Node properties interface.
 */
export interface NodeProps {
    nodeId?: string;
    text?: string;
    nodes?: string[];
    state?: {
        checked?: boolean;
        disabled?: boolean;
        expanded?: boolean;
        selected?: boolean;
    };

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
    parentData?: ParentDataType;
}

/**
 * Type for internal command queue in the tree.
 */
export interface CommandQueueType {
    nodeId: string;
    type: string;
    value: any;
}

/**
 * Defines the TreeDataType format
 */
export interface TreeDataType {
    [key: string]: NodeProps;
}

/**
 * Checkbox states
 */
export const Checkbox = {
    CHECKED: true,
    UNCHECKED: false,
    PARTIALLY: null as boolean,
};

/**
 * Callback function for CheckboxButton.
 */
export interface CheckboxButtonOnChangeType {
    (checked: boolean, nodeId: string): void;
}

/**
 * CheckboxButton properties definition.
 */
export interface CheckboxButtonProps {
    onChange: (checked: boolean) => void;
    checked: boolean;
    checkedIcon: string;
    partiallyCheckedIcon: string;
    uncheckedIcon: string;
}

/**
 * Callback function for ExpandButton.
 */
export interface ExpandButtonOnChangeType {
    (nodeId: string, opened: boolean): void;
}

/**
 * ExpandButton properties definition.
 */
export interface ExpandButtonProps {
    onChange: (checked: boolean) => void;
    expanded: boolean;
    loading: boolean; // null when error occurred.
    expandIcon: string;
    collapseIcon: string;
    loadingIcon: string;
    errorIcon: string;
}
