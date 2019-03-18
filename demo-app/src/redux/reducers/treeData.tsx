import { Tree } from '../../components/Tree';
import { TreeActionType } from '../types';
import { TreeData } from '../../components/Node';

const treeData = (state: TreeData = null, action: TreeActionType): TreeData => {
    switch (action.type) {
        case 'state.expanded':
            let node = Tree.nodeSelector(state, action.nodeId);

            if (node == null) {
                return state;
            }

            node = Tree.nodeExpanded(node, action.value);
            return Tree.nodeUpdater(state, node);
        default:
            return state;
    }
};

export default treeData;
