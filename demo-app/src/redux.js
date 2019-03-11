import { combineReducers } from "redux";
import { generator } from "Generator-Bigger";
import { Tree } from "./components/Tree.tsx";

const initialState = {
    tree: Tree.initTree(generator()),
};

export const callBack = (type, nodeId, value) => ({
    type: type,
    nodeId: nodeId,
    value: value
});

const tree = (state = initialState, action) => {
    switch (action.type) {
        case "state.expanded":
            let node = Tree.nodeSelector(state, action.nodeId);
            if (node == null) return state;
            node = Tree.nodeExpanded(node, action.value);
            state = Tree.nodeUpdater(state, node);
            break;
        default:
            return state;
    }

    return state;
};

export default combineReducers({
    tree
});
