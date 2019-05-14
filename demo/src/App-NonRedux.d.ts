import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { CommandQueueType, NodeProps, TreeDataType } from 'react-wooden-tree';
interface AppState {
    tree: TreeDataType;
}
export declare class AppNonRedux extends React.Component<{}, AppState> {
    state: {
        tree: TreeDataType;
    };
    /**
     * The callback function for changing data in the tree.
     *
     * @param {[string, string, any]} commands The array of node changing commands.
     */
    onDataChange: (commands: CommandQueueType[]) => void;
    lazyLoad: (node: NodeProps) => Promise<TreeDataType>;
    render(): JSX.Element;
}
export default AppNonRedux;
