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
        };
    else
        return { visible: false, checked: false, onChange: onChange };
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
        label: "Root",
        items: [
            { label: "First node" },
            { label: "Parent node", opened: true,
                items: [
                    { label: "Child node 1" },
                    { label: "Child node 2", opened: true,
                        items: [
                            { label: "Child node 2.1" },
                            { label: "Child node 2.2" }
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
        _this.handleCheckboxChange = function (checked, id) {
            console.log("Check: " + checked + " id: " + id, _this);
            var node = _this.nodeSelector(id);
            node.checkbox.checked = checked;
        };
        _this.state = {
            checked: false,
            item: _this.initList(_this.props.tree),
        };
        return _this;
    }
    Tree.prototype.initList = function (item) {
        item.id = "0";
        item.checkbox = Checkbox_1.CheckboxDataFactory(item.checkbox, this.handleCheckboxChange);
        item = Item_1.ItemPropsFactory(item);
        var items = [];
        if (item.items != null)
            for (var i = 0; i < item.items.length; i++) {
                item.items[i].checkbox = Checkbox_1.CheckboxDataFactory(item.items[i].checkbox, item.checkbox.onChange);
                item.items[i].id = item.id + "." + i;
                items.push(Item_1.ItemPropsFactory(item.items[i]));
            }
        item.items = items;
        item.opened = true;
        return item;
    };
    Tree.prototype.nodeSelector = function (id) {
        var path = id.split('.').map(function (item) {
            return parseInt(item, 10);
        });
        var node = this.state.item;
        for (var i = 1; i < path.length; i++) {
            node = node.items[path[i]];
        }
        return node;
    };
    Tree.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("ul", null,
                React.createElement(Item_1.Item, { key: this.state.item.id, id: this.state.item.id, label: this.state.item.label, items: this.state.item.items, opened: this.state.item.opened, checkbox: this.state.item.checkbox }))));
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
function ItemPropsFactory(item) {
    var items = [];
    if (item.items != null)
        for (var i = 0; i < item.items.length; i++) {
            item.items[i].checkbox = Checkbox_1.CheckboxDataFactory(item.items[i].checkbox, item.checkbox.onChange);
            item.items[i].id = item.id + "." + i;
            items.push(ItemPropsFactory(item.items[i]));
        }
    return {
        id: item.id,
        label: item.label,
        items: items,
        checkbox: item.checkbox,
        opened: Helpers_1.defVal(item.opened, false)
    };
}
exports.ItemPropsFactory = ItemPropsFactory;
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
    Item.prototype.renderSublist = function () {
        if (this.props.items && this.props.opened) {
            return this.props.items.map(function (item) {
                return (React.createElement(Item, { key: item.id, id: item.id, label: item.label, items: item.items, opened: Helpers_1.defVal(item.opened, false), checkbox: item.checkbox }));
            });
        }
        else
            return null;
    };
    Item.prototype.render = function () {
        return (React.createElement("li", null,
            React.createElement(Checkbox_1.Checkbox, { onChange: this.handleCheckChange, checked: this.props.checkbox.checked }),
            this.props.label,
            React.createElement("ul", null, this.renderSublist())));
    };
    return Item;
}(React.Component));
exports.Item = Item;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map