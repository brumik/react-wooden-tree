import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { CommandQueueType, NodeProps, TreeDataType, TreeCallBackFunction } from 'react-wooden-tree';
interface AppProps {
    TreeDataType?: TreeDataType;
    callBack: TreeCallBackFunction;
}
interface AppState {
    commandHistory: (CommandQueueType & {
        key: Number;
    })[];
}
/** The store */
export declare const store: import("redux").Store<{
    treeData: TreeDataType;
}, import("redux").AnyAction>;
declare class App extends React.Component<AppProps, AppState> {
    private uKey;
    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: AppProps);
    /**
     * On data change this function is called. In this example it is just
     * dispatches redux event (and for demo app purposes logs the dispatched event).
     *
     * @param command The commands which is requested by the tree.
     */
    onDataChange: (command: CommandQueueType[]) => void;
    /**
     * The lazy load callback returns a new promise. In this example
     * we return few children if it was requested for a specific node id.
     * Otherwise we return reject.
     *
     * @param node The node which is getting lazy loaded
     */
    lazyLoad: (node: NodeProps) => Promise<TreeDataType>;
    /**
     * Helper function to do something with all the parent nodes.
     * Used for command buttons in the demo app.
     */
    actionToAllRoot: (type: string, value: any) => void;
    render(): JSX.Element;
}
export declare const ConnectedApp: import("react-redux").ConnectedComponentClass<typeof App, Pick<AppProps, never>>;
export {};
