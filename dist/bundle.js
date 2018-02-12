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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
var Item_1 = __webpack_require__(6);
var Helpers_1 = __webpack_require__(1);
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Values which are not displayed therefore no need to store them in state.
         *
         * @type ListVal
         */
        _this.val = {
            checkedItemNumber: 0,
        };
        _this.handleOwnCheckChange = _this.handleOwnCheckChange.bind(_this);
        _this.handleItemCheckChange = _this.handleItemCheckChange.bind(_this);
        return _this;
    }
    List.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.checkbox.checked != this.props.checkbox.checked) {
            this.val.checkedItemNumber = nextProps.checkbox.checked ? this.props.items.length : 0;
        }
    };
    /**
     * Updates the checked and checkedItemNumber state.
     * If checked the checkedItemNumber will be the max
     * and if not the checkedItemNumber will be zero.
     * @param {boolean} checked Indicates the required checked state.
     */
    List.prototype.checkChange = function (checked) {
        this.val.checkedItemNumber = (checked ? this.props.items.length : 0);
        if (this.props.checkbox.checked !== checked)
            this.props.checkbox.onChange(checked);
    };
    /**
     * Item change handler.
     *
     * @param {boolean} checked The list checkbox state.
     */
    List.prototype.handleItemCheckChange = function (checked) {
        var checkedItemNumber = this.val.checkedItemNumber;
        console.log("ID: " + this.props.id + " " + this.props.checkbox.checked + " and got: " + checked);
        checkedItemNumber += (checked ? 1 : -1);
        console.log(checkedItemNumber);
        if (checkedItemNumber === this.props.items.length) {
            this.checkChange(true);
        }
        else if (checkedItemNumber === 0) {
            this.checkChange(false);
        }
        else
            this.val.checkedItemNumber = checkedItemNumber;
    };
    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    List.prototype.handleOwnCheckChange = function (event) {
        var target = event.target;
        this.checkChange(target.checked);
    };
    /**
     * Creates a checkbox if not provided with item value then whit own values.
     * Makes sure to passing default value forward.
     *
     * @param {ItemProps} item
     * @returns {CheckboxData}
     */
    List.prototype.defaultCheckbox = function (item) {
        var checkbox = {
            visible: this.props.checkbox.visible,
            checked: this.props.checkbox.checked,
            onChange: this.handleItemCheckChange,
        };
        if (item.checkbox) {
            checkbox.visible = Helpers_1.defVal(item.checkbox.visible, checkbox.visible);
            // TODO inheritance checked.
        }
        return checkbox;
    };
    /**
     * Renders items in list. Sets default ID of parent if not given to 1.
     *
     * @returns {JSX.Element[]}
     */
    List.prototype.renderItems = function () {
        var _this = this;
        var id = Helpers_1.defVal(this.props.id, '1');
        return this.props.items.map(function (item, idx) {
            return (React.createElement(Item_1.Item, { key: id + '.' + idx, id: id + '.' + idx, label: item.label, items: item.items, checkbox: _this.defaultCheckbox(item) }));
        });
    };
    List.prototype.render = function () {
        return (React.createElement("ul", null, this.renderItems()));
    };
    return List;
}(React.Component));
exports.List = List;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(4);
var Tree_1 = __webpack_require__(5);
ReactDOM.render(React.createElement(Tree_1.Tree, { id: "0", items: [
        { label: "First node" },
        { label: "Parent node",
            items: [
                { label: "Child node 1" },
                { label: "Child node 2",
                    items: [
                        { label: "Child node 2.1" },
                        { label: "Child node 2.2" }
                    ] }
            ]
        }
    ] }), document.getElementById("app"));


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 5 */
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
var List_1 = __webpack_require__(2);
var Helpers_1 = __webpack_require__(1);
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            checked: false
        };
        return _this;
    }
    Tree.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("p", null, "Will be a tree 2"),
            React.createElement(List_1.List, { id: this.props.id, items: this.props.items, checkbox: {
                    visible: Helpers_1.defVal(this.props.checkboxes, false),
                    checked: this.state.checked,
                    onChange: function (checked) { return _this.setState({ checked: checked }); },
                } })));
    };
    return Tree;
}(React.Component));
exports.Tree = Tree;


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
var List_1 = __webpack_require__(2);
var Helpers_1 = __webpack_require__(1);
var Checkbox_1 = __webpack_require__(7);
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            checked: _this.props.checkbox.checked,
        };
        _this.handleOwnCheckChange = _this.handleOwnCheckChange.bind(_this);
        _this.handleListCheckChange = _this.handleListCheckChange.bind(_this);
        return _this;
    }
    /**
     * When receiving new props updates:
     * checked: If parent changes children should reflect it.
     *
     * @param {ItemProps} nextProps
     */
    Item.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.checkbox.checked != this.props.checkbox.checked) {
            this.setState(function (currState, nextProps) {
                return { checked: nextProps.checkbox.checked };
            });
        }
    };
    /**
     * Updates the state and informs parent about change.
     * @param {boolean} checked Indicates checkbox state.
     */
    Item.prototype.checkChange = function (checked) {
        this.setState({ checked: checked });
        this.props.checkbox.onChange(checked);
    };
    /**
     * List change handler.
     * @param {boolean} checked The list checkbox state.
     */
    Item.prototype.handleListCheckChange = function (checked) {
        this.checkChange(checked);
    };
    /**
     * Own checkbox handler.
     * @param {React.FormEvent<HTMLInputElement>} event Contains the input field value.
     */
    Item.prototype.handleOwnCheckChange = function (event) {
        var target = event.target;
        this.checkChange(target.checked);
    };
    Item.prototype.renderSublist = function () {
        if (this.props.items) {
            var id = Helpers_1.defVal(this.props.id, '1');
            return (React.createElement(List_1.List, { id: id, items: this.props.items, checkbox: {
                    visible: this.props.checkbox.visible,
                    checked: this.state.checked,
                    onChange: this.handleListCheckChange
                } }));
        }
        else
            return null;
    };
    Item.prototype.render = function () {
        return (React.createElement("li", null,
            React.createElement(Checkbox_1.Checkbox, { onChange: this.handleOwnCheckChange, checked: this.state.checked }),
            this.props.label,
            this.renderSublist()));
    };
    return Item;
}(React.Component));
exports.Item = Item;


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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map