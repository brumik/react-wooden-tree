import { TreeData } from '../internal';

export interface TreeActionType {
    type: string;
    nodeId: string;
    value: any;
}

export interface TreeCallBackFunction {
    (nodeId: string, type: string, value: any): TreeActionType;
}

export interface TreeState {
    treeData: TreeData;
}

export const ActionTypes = {
    EXPANDED: 'state.expanded',
    CHECKED: 'state.checked',
    DISABLED: 'state.disabled',
    SELECTED: 'state.selected',
    CHILD_NODES: 'child_nodes',
    ADD_NODES: 'add.nodes',
    LOADING: 'loading'
};
