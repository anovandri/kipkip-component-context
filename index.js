"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ComponentsProvider = undefined;
exports.withComponents = withComponents;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require("hoist-non-react-statics");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * @see https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
 * @param {Object} HOC The higher-order component
 * @param {Object} WrappedComponent The wrapped component
 * @returns {undefined}
 */
function wrapDisplayName(HOC, WrappedComponent) {
    var innerDisplayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    HOC.displayName = "WithComponents(" + innerDisplayName + ")";
}

var ComponentsContext = _react2.default.createContext();

var ComponentsProvider = exports.ComponentsProvider = ComponentsContext.Provider;

/**
 * @name withComponents
 * @method
 * @param {React.Component} Component A React component class
 * @param {String} [prefix] A prefix to look for on keys of the components object, to
 *   override the primary component. Default is `Component.name`
 * @returns {React.Component} A new React component that wraps the passed in component,
 *   passing it a `components` prop from the nearest `ComponentsProvider`. If the
 *   `components` prop is provided already, the two objects are merged with
 *   the prop overriding the context.
 */
function withComponents(Component) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Component.name;

    var WithComponents = _react2.default.forwardRef(function (props, ref) {
        return _react2.default.createElement(
            ComponentsContext.Consumer,
            null,
            function (componentsFromContext) {
                var componentsFromProps = props.components,
                    otherProps = _objectWithoutProperties(props, ["components"]);

                var components = null;
                if (componentsFromContext || componentsFromProps) {
                    components = Object.assign({}, componentsFromContext || {}, componentsFromProps || {});

                    // Look for prefix overrides. For example, wrapping a component named
                    // ContactForm that uses the `Button` component, it would look for
                    // `ContactForm_Button` component and pass that as the `components.Button` instead
                    // if found.
                    if (prefix) {
                        Object.keys(componentsFromContext || {}).forEach(function (name) {
                            var namePieces = name.split("_");
                            if (namePieces[0] === prefix) {
                                components[namePieces[1]] = componentsFromContext[name];
                            }
                        });
                    }
                }

                return _react2.default.createElement(Component, Object.assign({ ref: ref }, otherProps, { components: components }));
            }
        );
    });

    // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
    (0, _hoistNonReactStatics2.default)(WithComponents, Component);

    // https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
    wrapDisplayName(WithComponents, Component);

    return WithComponents;
}
