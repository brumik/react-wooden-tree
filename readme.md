# React Wooden Tree
A simple solution to display hierarchical structures (Tree View) while using React.

## Dependencies
To use the Wooden Tree two requirements must met.
* [React](https://reactjs.org/)
* [Font Awesome](https://fontawesome.com/) - only if using default icons

## Install
The component can be installed with `npm`:
```bash
npm install -save react-wooden-tree
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
```json
tree = [
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

// Styling
icon?: string;                      // < Custom icon for the node.
image?: string;                     // < Custom image for the node - preferred over the icon.
classes?: string;                   // < Custom classes for the node.
```