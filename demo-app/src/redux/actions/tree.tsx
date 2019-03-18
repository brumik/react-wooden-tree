import { TreeActionType } from '../types';

export const callBack = (nodeId: string, type: string, value: boolean): TreeActionType => ({
    nodeId: nodeId,
    type: type,
    value: value
});

export default callBack;
