import { TreeData } from '../components/Node';

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
    NODES: 'nodes',
    LOADING: 'loading'
};
