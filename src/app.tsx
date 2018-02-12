import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tree } from "./components/Tree";

ReactDOM.render(
    <Tree
        id={"0"}
        items={
            [
                {label: "First node"},
                {label: "Parent node",
                    items: [
                        {label: "Child node 1"},
                        {label: "Child node 2",
                            items: [
                                {label: "Child node 2.1"},
                                {label: "Child node 2.2"}
                            ]}
                    ]
                }
            ]
        }

    />,
    document.getElementById("app")
);