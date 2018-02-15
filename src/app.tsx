import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tree } from "./components/Tree";

ReactDOM.render(
    <Tree
        checkboxes={false}
        tree={{
            text: "Root",
            nodes:[
                {text: "First node"},
                {text: "Parent node", opened: true, checkbox: {visible: true},
                    nodes: [
                        {text: "Child node 1"},
                        {text: "Child node 2", opened: false,
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