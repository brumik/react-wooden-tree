import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tree } from "./components/Tree";

ReactDOM.render(
    <Tree
        id={"0"}
        list={{
            items: [
                {label: "First node"},
                {label: "Parent node", list: {
                    items: [
                        {label: "Child node 1"},
                        {label: "Child node 2"}
                    ]
                    }}
                ]
        }}

    />,
    document.getElementById("app")
);