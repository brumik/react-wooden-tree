import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tree } from "./components/Tree";

ReactDOM.render(
    <Tree
        tree={{
            label: "Root",
            items:[
                {label: "First node"},
                {label: "Parent node", opened: true,
                    items: [
                            {label: "Child node 1"},
                            {label: "Child node 2", opened: true,
                                items: [
                                        {label: "Child node 2.1"},
                                        {label: "Child node 2.2"}
                                    ]

                            }
                        ]

                }
            ]
        }}
    />,
    document.getElementById("app")
);