/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function defVal(variable, defaultValue) {
    return variable != null ? variable : defaultValue;
}
exports.defVal = defVal;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Helpers_1 = __webpack_require__(1);
function CheckboxDataFactory(checkbox, onChange) {
    if (checkbox != null)
        return {
            visible: Helpers_1.defVal(checkbox.visible, false),
            checked: Helpers_1.defVal(checkbox.checked, false),
            onChange: onChange,
            childrenCheckedCount: 0
        };
    else
        return { visible: false, checked: false, onChange: onChange, childrenCheckedCount: 0 };
}
exports.CheckboxDataFactory = CheckboxDataFactory;
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Checkbox.prototype.render = function () {
        return (React.createElement("input", { type: "checkbox", checked: this.props.checked, onChange: this.props.onChange }));
    };
    return Checkbox;
}(React.Component));
exports.Checkbox = Checkbox;


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(5);
var Tree_1 = __webpack_require__(6);
ReactDOM.render(React.createElement(Tree_1.Tree, { tree: {
        text: "Root",
        nodes: [
            { text: "First node" },
            { text: "Parent node", opened: true,
                nodes: [
                    { text: "Child node 1" },
                    { text: "Child node 2", opened: true,
                        nodes: [
                            { text: "Child node 2.1" },
                            { text: "Child node 2.2" }
                        ]
                    }
                ]
            }
        ]
    } }), document.getElementById("app"));


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Item_1 = __webpack_require__(7);
var Checkbox_1 = __webpack_require__(2);
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Handles checkbox change if made on checkbox.
         *
         * @param {boolean} checked The checkbox new state.
         * @param {string} id The element which checkbox was changed.
         */
        _this.handleCheckboxChange = function (checked, id) {
            var node = _this.nodeSelector(id);
            _this.nodeCheckboxChange(checked, node);
            _this.setState({ node: _this.node });
        };
        _this.node = _this.initList(_this.props.tree);
        _this.state = {
            node: _this.node,
        };
        return _this;
    }
    /**
     * Initializes the first list node and other are initialized recursively.
     *
     * @param {NodeProps} node
     * @returns {NodeProps}
     */
    Tree.prototype.initList = function (node) {
        node.id = "0";
        node.checkbox = Checkbox_1.CheckboxDataFactory(node.checkbox, this.handleCheckboxChange);
        node = Item_1.NodePropsFactory(node);
        node.opened = true;
        return node;
    };
    /**
     * Searches for the node by id. And returns it.
     * @param {string} id
     * @returns {NodeProps}
     */
    Tree.prototype.nodeSelector = function (id) {
        var path = id.split('.').map(function (node) {
            return parseInt(node, 10);
        });
        var node = this.node;
        for (var i = 1; i < path.length; i++) {
            node = node.nodes[path[i]];
        }
        return node;
    };
    Tree.prototype.parentCheckboxChange = function (checked, node) {
        // Root node:
        if (node.id === "0")
            return;
        // Others:
        var parentID = node.id.substring(0, node.id.length - 2);
        var parentNode = this.nodeSelector(parentID);
        parentNode.checkbox.childrenCheckedCount += checked ? 1 : -1;
        if (parentNode.checkbox.childrenCheckedCount === parentNode.nodes.length) {
            parentNode.checkbox.checked = true;
            this.parentCheckboxChange(true, parentNode);
        }
        else if (parentNode.checkbox.childrenCheckedCount === 0) {
            parentNode.checkbox.checked = false;
        }
    };
    /**
     * Changes sthe sate of the node and all children recursively.
     *
     * @param {boolean} checked The new state of the node.
     * @param {NodeProps} node The node to change the state.
     *
     * Todo If all children are selected select parent.
     */
    Tree.prototype.nodeCheckboxChange = function (checked, node) {
        if (node.nodes) {
            node.checkbox.checked = checked;
            node.checkbox.childrenCheckedCount = checked ? node.nodes.length : 0;
            for (var i = 0; i < node.nodes.length; i++)
                this.nodeCheckboxChange(checked, node.nodes[i]);
        }
        this.parentCheckboxChange(checked, node);
    };
    Tree.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("ul", null,
                React.createElement(Item_1.Item, { key: this.state.node.id, id: this.state.node.id, text: this.state.node.text, nodes: this.state.node.nodes, opened: this.state.node.opened, checkbox: this.state.node.checkbox }))));
    };
    return Tree;
}(React.Component));
exports.Tree = Tree;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Helpers_1 = __webpack_require__(1);
var Checkbox_1 = __webpack_require__(2);
function NodePropsFactory(node) {
    var nodes = [];
    if (node.nodes != null)
        for (var i = 0; i < node.nodes.length; i++) {
            node.nodes[i].checkbox = Checkbox_1.CheckboxDataFactory(node.nodes[i].checkbox, node.checkbox.onChange);
            // Count the checked children nodes.
            if (node.nodes[i].checkbox.checked)
                node.checkbox.childrenCheckedCount++;
            node.nodes[i].id = node.id + "." + i;
            nodes.push(NodePropsFactory(node.nodes[i]));
        }
    return {
        id: node.id,
        text: node.text,
        nodes: nodes,
        checkbox: node.checkbox,
        opened: Helpers_1.defVal(node.opened, false)
    };
}
exports.NodePropsFactory = NodePropsFactory;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(props) {
        var _this = _super.call(this, props) || this;
        _this.handleCheckChange = _this.handleCheckChange.bind(_this);
        return _this;
    }
    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    Item.prototype.handleCheckChange = function (event) {
        var target = event.target;
        this.props.checkbox.onChange(target.checked, this.props.id);
    };
    /**
     * @returns {JSX.Element[]} The rendered nodes.
     */
    Item.prototype.renderSublist = function () {
        if (this.props.nodes && this.props.opened) {
            var nodes = [];
            for (var i = 0; i < this.props.nodes.length; i++) {
                nodes.push(React.createElement(Item, { key: this.props.nodes[i].id, id: this.props.nodes[i].id, text: this.props.nodes[i].text, nodes: this.props.nodes[i].nodes, opened: this.props.nodes[i].opened, checkbox: this.props.nodes[i].checkbox }));
            }
            return nodes;
        }
        else
            return null;
    };
    Item.prototype.render = function () {
        return (React.createElement("li", null,
            React.createElement(Checkbox_1.Checkbox, { onChange: this.handleCheckChange, checked: this.props.checkbox.checked }),
            this.props.text,
            React.createElement("ul", null, this.renderSublist())));
    };
    return Item;
}(React.Component));
exports.Item = Item;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map