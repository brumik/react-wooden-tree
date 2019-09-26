import { TreeActionType } from '../..';

export const callBack = (nodeId: string, type: string, value: any): TreeActionType => ({
    nodeId: nodeId,
    type: type,
    value: value
});
