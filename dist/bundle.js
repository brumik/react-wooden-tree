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
/* 3 */
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
var Helpers_1 = __webpack_require__(1);
var Checkbox_1 = __webpack_require__(2);
function ListPropsFactory(list) {
    var items = [];
    if (list.items != null)
        for (var i = 0; i < list.items.length; i++) {
            list.items[i].checkbox = Checkbox_1.CheckboxDataFactory(list.items[i].checkbox, list.checkbox.onChange);
            list.items[i].id = list.id + "." + i;
            items.push(Item_1.ItemPropsFactory(list.items[i]));
        }
    return {
        id: list.id,
        items: items,
        checkbox: list.checkbox,
    };
}
exports.ListPropsFactory = ListPropsFactory;
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.render = function () {
        var items = this.props.items.map(function (item) {
            return (React.createElement(Item_1.Item, { key: item.id, id: item.id, label: item.label, list: item.list, opened: Helpers_1.defVal(item.opened, false), checkbox: item.checkbox }));
        });
        return (React.createElement("ul", null, items));
    };
    return List;
}(React.Component));
exports.List = List;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(5);
var Tree_1 = __webpack_require__(6);
ReactDOM.render(React.createElement(Tree_1.Tree, { list: {
        items: [
            { label: "First node" },
            { label: "Parent node", opened: true,
                list: {
                    items: [
                        { label: "Child node 1" },
                        { label: "Child node 2", opened: true,
                            list: {
                                items: [
                                    { label: "Child node 2.1" },
                                    { label: "Child node 2.2" }
                                ]
                            }
                        }
                    ]
                }
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
var List_1 = __webpack_require__(3);
var Checkbox_1 = __webpack_require__(2);
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            checked: false,
            list: _this.initList(_this.props.list),
        };
        _this.handleCheckboxChange = _this.handleCheckboxChange.bind(_this);
        return _this;
    }
    Tree.prototype.initList = function (list) {
        list.id = "0";
        list.checkbox = Checkbox_1.CheckboxDataFactory(list.checkbox, this.handleCheckboxChange);
        list = List_1.ListPropsFactory(list);
        return list;
    };
    Tree.prototype.handleCheckboxChange = function (checked, id) {
        console.log("Check: " + checked + " id: " + id);
    };
    Tree.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("p", null, "Will be a tree 2"),
            React.createElement(List_1.List, { items: this.state.list.items, checkbox: this.state.list.checkbox })));
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
var List_1 = __webpack_require__(3);
var Helpers_1 = __webpack_require__(1);
var Checkbox_1 = __webpack_require__(2);
function ItemPropsFactory(item) {
    var list = item.list;
    if (list != null) {
        list.id = item.id;
        list.checkbox = Checkbox_1.CheckboxDataFactory(list.checkbox, item.checkbox.onChange);
        list = List_1.ListPropsFactory(list);
    }
    return {
        id: item.id,
        label: item.label,
        list: list,
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
        if (this.props.list && this.props.list.items && this.props.opened) {
            return (React.createElement(List_1.List, { id: this.props.id, items: this.props.list.items, checkbox: this.props.checkbox }));
        }
        else
            return null;
    };
    Item.prototype.render = function () {
        return (React.createElement("li", null,
            React.createElement(Checkbox_1.Checkbox, { onChange: this.handleCheckChange, checked: this.props.checkbox.checked }),
            this.props.label,
            this.renderSublist()));
    };
    return Item;
}(React.Component));
exports.Item = Item;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map