import { TreeData, Tree, ActionTypes, TreeActionType, NodeProps } from '../../internal';

const actionMapper: {[key: string]: (node: NodeProps, value: any) => NodeProps} = {
    [ActionTypes.EXPANDED]: Tree.nodeExpanded,
    [ActionTypes.CHECKED]: Tree.nodeChecked,
    [ActionTypes.DISABLED]: Tree.nodeDisabled,
    [ActionTypes.SELECTED]: Tree.nodeSelected,
    [ActionTypes.CHILD_NODES]: Tree.nodeChildren,
    [ActionTypes.LOADING]: Tree.nodeLoading,
};

const treeData = (state: TreeData = null, action: TreeActionType): TreeData => {
    switch (action.type) {
        case ActionTypes.EXPANDED:
        case ActionTypes.SELECTED:
        case ActionTypes.CHECKED:
        case ActionTypes.CHILD_NODES:
        case ActionTypes.LOADING:
        case ActionTypes.DISABLED:
            let node = Tree.nodeSelector(state, action.nodeId);
            if ( node == null ) { return state; }

            if (actionMapper.hasOwnProperty(action.type)) {
                node = actionMapper[action.type](node, action.value);
                return Tree.nodeUpdater(state, node);
            } else {
                return { state };
            }
        case ActionTypes.ADD_NODES:
            // TODO
            return state;
        default:
            return state;
    }
};

export default treeData;
