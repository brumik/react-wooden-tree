import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tree } from "./components/Tree";

ReactDOM.render(
    <Tree
        checkable={false}
        tree={{
            text: "Root",
            nodes:[
                {text: "First node"},
                {text: "Parent node", state: {expanded: true}, checkable: true,
                    nodes: [
                        {text: "Child node 1", state: {expanded: false, checked: true}},
                        {text: "Child node 2", state: {checked: true},
                            nodes: [
                                {text: "Child node 2.1"},
                                {text: "Child node 2.2"}
                            ]
                        }
                    ]
                }
            ]
        }}
    />,
    document.getElementById("app")
);