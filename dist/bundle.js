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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Item_1 = __webpack_require__(6);
var Helpers_1 = __webpack_require__(2);
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            checkedItemNumber: 0,
        };
        _this.handleOwnCheckChange = _this.handleOwnCheckChange.bind(_this);
        _this.handleItemCheckChange = _this.handleItemCheckChange.bind(_this);
        return _this;
    }
    /**
     * Updates the checked and checkedItemNumber state.
     * If checked the checkedItemNumber will be the max
     * and if not the checkedItemNumber will be zero.
     * @param {boolean} checked Indicates the required checked state.
     */
    List.prototype.checkChange = function (checked) {
        this.setState({ checkedItemNumber: (checked ? this.props.items.length : 0) });
        this.props.handleCheckChange(checked);
    };
    /**
     * Item change handler.
     * @param {boolean} checked The list checkbox state.
     */
    List.prototype.handleItemCheckChange = function (checked) {
        var checkedItemNumber = this.state.checkedItemNumber + (checked ? 1 : -1);
        if (checkedItemNumber === this.props.items.length) {
            this.checkChange(true);
        }
        else
            this.setState({ checkedItemNumber: checkedItemNumber });
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
     * Renders items in list. Sets default ID of parent if not given to 1.
     *
     * @returns {JSX.Element[]}
     */
    List.prototype.renderItems = function () {
        var _this = this;
        var id = Helpers_1.defaultIfNotExists(this.props.id, '1');
        return this.props.items.map(function (item, idx) {
            return (React.createElement(Item_1.Item, __assign({ key: id + '.' + idx, id: id + '.' + idx }, item, { checked: _this.props.checked, handleCheckChange: _this.handleItemCheckChange })));
        });
    };
    List.prototype.render = function () {
        return (React.createElement("ul", null, this.renderItems()));
    };
    return List;
}(React.Component));
exports.List = List;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function defaultIfNotExists(variable, defaultValue) {
    return variable ? variable : defaultValue;
}
exports.defaultIfNotExists = defaultIfNotExists;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(4);
var Tree_1 = __webpack_require__(5);
ReactDOM.render(React.createElement(Tree_1.Tree, { id: "0", list: {
        items: [
            { label: "First node" },
            { label: "Parent node", list: {
                    items: [
                        { label: "Child node 1" },
                        { label: "Child node 2" }
                    ]
                } }
        ]
    } }), document.getElementById("app"));


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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var List_1 = __webpack_require__(1);
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(props) {
        return _super.call(this, props) || this;
    }
    Tree.prototype.render = function () {
        return (React.createElement("div", { id: this.props.id },
            React.createElement("p", null, "Will be a tree"),
            React.createElement(List_1.List, __assign({ id: this.props.id }, this.props.list))));
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var List_1 = __webpack_require__(1);
var Helpers_1 = __webpack_require__(2);
var Checkbox_1 = __webpack_require__(7);
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            checked: Helpers_1.defaultIfNotExists(_this.props.checked, false),
        };
        _this.handleOwnCheckChange = _this.handleOwnCheckChange.bind(_this);
        _this.handleListCheckChange = _this.handleListCheckChange.bind(_this);
        _this.checkChange = _this.checkChange.bind(_this);
        return _this;
    }
    Item.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.checked != this.props.checked) {
            this.setState(function (currState, nextProps) {
                return { checked: nextProps.checked };
            });
        }
    };
    /**
     * Updates the state and informs parent about change.
     * @param {boolean} checked Indicates checkbox state.
     */
    Item.prototype.checkChange = function (checked) {
        this.setState({ checked: checked });
        this.props.handleCheckChange(checked);
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
        if (this.props.list) {
            var id = Helpers_1.defaultIfNotExists(this.props.id, '1');
            var list = Helpers_1.defaultIfNotExists(this.props.list, null);
            return (React.createElement(List_1.List, __assign({ id: id }, list, { checked: this.state.checked, handleCheckChange: this.handleListCheckChange })));
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