# React Wooden Tree 

[![Build Status](https://travis-ci.com/brumik/react-wooden-tree.svg?branch=master)](https://travis-ci.com/brumik/react-wooden-tree)

A simple solution to display hierarchical structures (Tree View) while using React.

## Dependencies
To use the Wooden Tree two requirements must met.
* [React](https://reactjs.org/)
* [Font Awesome](https://fontawesome.com/) - only if using default icons

## Install
The component can be installed with `npm`:
```bash
npm install --save react-wooden-tree
```

or you can download manually from this repository.

## Basic usage
Include in your react app the component:
```typescript
import { Tree } from 'react-wooden-tree';

// If icons are left to default include the fa as well:
import 'font-awesome/css/font-awesome.min.css';
```

To let the tree work correctly some functions must be implemented to work whit the data:
```typescript
actionMapper = {
    'state.expanded': Tree.nodeExpanded,
    'state.checked': Tree.nodeChecked,
    'state.disabled': Tree.nodeDisabled,
    'state.selected': Tree.nodeSelected,
    'nodes': Tree.nodeChildren,
    'loading': Tree.nodeLoading,
};

constructor(props: {}) {
    super(props);

    // Before usage the tree should be initialized:
    this.data = Tree.initTree(treeStructure);

    this.state = {
        tree: this.data,
    };

    this.onDataChange = this.onDataChange.bind(this);
    this.lazyLoad = this.lazyLoad.bind(this);
}

onDataChange(id: string, type: string, value: boolean): void {
    let node = Tree.nodeSelector(this.data, id);
    if ( node == null ) { return; }

    if (this.actionMapper.hasOwnProperty(type)) {
        node = this.actionMapper[type](node, value);
        this.data = Tree.nodeUpdater(this.data, node);
    }
    
    // One way to update the tree to set the state variable.
    this.setState({tree: this.data});
}
```

Then you can render the tree:
```typescript
<Tree
    data={this.state.tree}
    onDataChange={this.onDataChange}
/>
```

**For working example look at demo-app/src/App.tsx.**

## Data format
The format to supply the data is the following:
```typescript
let treeStructure = [
    {text: 'Parent 1 - Expanded', state: {expanded: true, checked: true},
        nodes: [
            {text: 'Child 1 - Custom Icon', icon: 'fa fa-stop fa-fw', state: {checked: true}},
            {text: 'Child 2 - Non checkable and disabled', icon: 'fa fa-fw',
                checkable: false, state: {disabled: true}},
            {text: 'Child 3 - LazyLoadable', lazyLoad: true}
        ]
    },
    {text: 'Parent 2 - Not expanded', state: {expanded: false, checked: false},
        nodes: [
            {text: 'Child 1 - Custom Icon', icon: 'fa fa-stop fa-fw'},
            {text: 'Child 2 - No icon specified', classes: 'custom-class'},
            {text: 'Child 3 - Image icon', image: 'https://www.wpsuperstars.net/wp-content/uploads/2015/01/59.png'}
        ]
    }
]
```

## Tree options:
The full list of options is the following:

The `data` and the `onDataChange` functions are mandatory, others are optional.
```typescript
data: NodeProps[];                 // < The definitions of the tree nodes.

// Checkbox
showCheckbox?: boolean;             // < Option: whenever the checkboxes are displayed.
hierarchicalCheck?: boolean;        // < If enabled parent and children are reflecting each other changes.
checkboxFirst?: boolean;            // < Determines if the node icon or the checkbox is the first.

// Selection
multiSelect?: boolean;              // < Determines if multiple nodes can be selected.
preventDeselect?: boolean;          // < Determines if can be deselected all nodes.
allowReselect?: boolean;            // < Used with preventDeselect allows to fire selected event on selected node.

// Icons
showIcon?: boolean;                 // < Determines if the icons are showed in nodes.
showImage?: boolean;                // < Determines if images are preferred to the icons.
nodeIcon?: string;                  // < Default icon for nodes without it.
checkedIcon?: string;               // < The checkbox-checked icon.
uncheckedIcon?: string;             // < The checkbox-unchecked icon.
partiallyCheckedIcon?: string;      // < The checkbox-partially selected icon.
collapseIcon?: string;              // < The icon for collapsing parents.
expandIcon?: string;                // < The icon for expanding parents.
loadingIcon?: string;               // < The loading icon when loading data with ajax.
errorIcon?: string;                 // < The icon displayed when lazyLoading went wrong.
selectedIcon?: string;              // < The icon for selected nodes.

// Styling
changedCheckboxClass?: string;      // < Extra class for the changed checkbox nodes.
selectedClass?: string;             // < Extra class for the selected nodes.

// Callbacks
/**
 * All changes made in the tree will be propagated upwards.
 * Every time the tree changes the node's data the callback will be fired.
 *
 * @param {string} id The node's id.
 * @param {string} dataType The currently changed information.
 * @param {boolean} newValue The newly assigned value.
 */
onDataChange: (id: string, dataType: string, newValue: any) => void;

/**
 * The function which will be called when a lazily loadable node is
 * expanded first time.
 *
 * @param {NodeProps} node The node of the node which has to be loaded.
 * @returns {Promise<NodeProps[]>} Promise about the children of the given node.
 */
lazyLoad?: (node: NodeProps) => Promise<NodeProps[]>;
```

## Node option:
For each node the following options can be defined (types from typescript are not obligatory):

All options are optional expect the text.
```typescript
text: string;                       // < The text displayed in the node.
nodes?: NodeProps[];                // < The children nodes.
state?: {
    expanded: boolean;
    checked: boolean;
    selected: boolean;
    disabled: boolean;
};                                  // < The node states: checked, selected, expanded, disabled

checkable?: boolean;                // < If false the node is non checkable even if the checkbox is shown.
hideCheckbox?: boolean;             // < If true then the checkbox is not shown - use whit showCheckbox option.

selectable?: boolean;               // < Determines if the node can be selected.
selectedIcon?: string;              // < Sets the selected icon for the node.

lazyLoad?: boolean;                 // < Determines if the node calls the lazy loading function on expand.
loading?: boolean;                  // < Determines if the node is currently loading: Null when error occurred

attr?: {[key: string]: string};     // < The passed attributes which appear in HTML as well and are searchable.

// Styling
icon?: string;                      // < Custom icon for the node.
iconColor?: string;                 // < The color of the custom icon.
iconBackground?: string;            // < The background color of the custom icon.
image?: string;                     // < Custom image for the node - preferred over the icon.
classes?: string;                   // < Custom classes for the node.
```

## Additional options
The tree provides additional static methods over the data. In this section they are listed and explained.

### Initialize the tree
This function assigns node ids and initializes `state` object which are necessary fo the tree to work.
You can use it as `initializedTree = Tree.initTree(notInitializedTree);`.

```typescript
/**
 * Generates the IDs and states for all nodes recursively.
 * The IDs are crucial for the tree to work.
 * The state is needed to avoid not defined exceptions.
 *
 * @param {NodeProps[]} tree The tree to fill the IDs up.
 * @param {string} parentID The parent nodeId of the current nodes. For root left this param out.
 * @returns {NodeProps[]} The new filled tree.
 */
public static initTree(tree: NodeProps[], parentID: string = ''): NodeProps[]
```

### Select node by id
This function can be used if the tree was initialised with the `initTree` function or the ids are assigned identically.
(The id format: 0.5.1 -> The number of the node (starting from zero), where children are divided from its parents by a dot)
The function is pretty fast and works in a following way:
```typescript
/**
 * Searches for the node by nodeId, and returns it.
 * Search is done by walking the tree by index numbers got form the nodeId.
 *
 * @param {NodeProps[]} tree The tree which to look in the node for.
 * @param {string} nodeId The nodeId of the searched node.
 * @returns {NodeProps}
 * @warning Doesn't checks the validity of the nodeId.
 */
public static nodeSelector(tree: NodeProps[], nodeId: string): NodeProps
```

### Search by attribute name and string
To use this function there should be `data-*` attributes passed to the nodes. This can be done on node basis as the following:
`{text: 'Node with data attribute', attr: {'data-random': 'random'}}`. These attributes are appearing in HTML and can be used
to search for a node or nodes with the same attributes.

The function for searching can be called as: `Tree.nodeSearch(tree, nodeId, attributeName, attributeValue)` where
```typescript
/**
 * Searches trough the tree or subtree in attr field for the given string.
 * Only works if the nodeSelector can be applied on the tree.
 *
 * @param {NodeProps[]} tree The tree in which the function will search.
 * @param nodeID The id of the parent node (pass null if want to search the whole tree).
 * @param attrName The name of the attribute to search in.
 * @param searchString The string to search for.
 * @return string[] Array of ID's where the string is present.
 */
public static nodeSearch(tree: NodeProps[], nodeID: string, attrName: string, searchString: string): string[]
```
And you get back an array of node IDs where the attribute has the specified value.

### Other helper methods:
These methods helps to change data in the tree when an event occurred in the tree.

#### Helper: Node updater

```typescript
    /**
     * Updates the given node's reference in the tree.
     *
     * @param {NodeProps[]} tree Where the node will be updated.
     * @param {NodeProps} node The node to put reference in the tree.
     * @warning Doesn't checks the validity of the node's nodeId.
     */
    public static nodeUpdater(tree: NodeProps[], node: NodeProps): NodeProps[]
```

#### Helper: Node checker

```typescript
    /**
     * Helper function: Checks the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the checked field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeChecked(node: NodeProps, value: boolean): NodeProps
```

#### Helper: Node expander or collapser

```typescript
    /**
     * Helper function: Expands or collapses the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the expanded field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeExpanded(node: NodeProps, value: boolean): NodeProps
```

#### Helper: Node enabler/disabler

```typescript
    /**
     * Helper function: Disables or enables the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the disabled field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeDisabled(node: NodeProps, value: boolean): NodeProps
```

#### Helper: Node select changer

```typescript
    /**
     * Helper function: Selects or deselects the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new value of the selected field.
     * @returns {NodeProps} The changed node.
     */
    public static nodeSelected(node: NodeProps, value: boolean): NodeProps
```

#### Helper: Node children updater

```typescript
    /**
     * Helper function: Updates the children of the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} nodes The new children of the node.
     * @returns {NodeProps} The changed node.
     */
    public static nodeChildren(node: NodeProps, nodes: NodeProps[]): NodeProps
```

#### Helper: Node loading state update

```typescript
    /**
     * Helper function: Updates the loading state of the node.
     *
     * @param {NodeProps} node The node to change.
     * @param {boolean} value The new loading value.
     * @returns {NodeProps} The changed node.
     */
    public static nodeLoading(node: NodeProps, value: boolean): NodeProps
```
