import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tree } from "./components/Tree";

ReactDOM.render(
    <Tree
        list={{
            items: [
                {label: "First node"},
                {label: "Parent node", opened: true,
                    list: {
                        items: [
                            {label: "Child node 1"},
                            {label: "Child node 2", opened: true,
                                list: {
                                    items: [
                                        {label: "Child node 2.1"},
                                        {label: "Child node 2.2"}
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }}
    />,
    document.getElementById("app")
);