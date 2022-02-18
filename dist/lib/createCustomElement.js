"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomElement = void 0;
const createelement_1 = require("./createelement");
function createCustomElement(tagName, renderFunction, style) {
    var _BaseComponent_shadowRoot, _a;
    customElements.define(tagName, (_a = class BaseComponent extends HTMLElement {
            constructor() {
                super();
                _BaseComponent_shadowRoot.set(this, this.attachShadow({ mode: "closed" }));
            }
            getProperties() {
                return this.getAttributeNames().reduce((all, name) => (Object.assign(Object.assign({}, all), { [name]: this.getAttribute(name) })), Object.assign({}, this.dataset));
            }
            connectedCallback() {
                const props = this.getProperties();
                let styleElm = style;
                if (typeof style === "function") {
                    styleElm = (0, createelement_1.h)(style, props);
                }
                else if (typeof style === "string") {
                    styleElm = document.createElement("style");
                    styleElm.innerHTML = style;
                }
                if (styleElm !== undefined) {
                    __classPrivateFieldGet(this, _BaseComponent_shadowRoot, "f").append(styleElm);
                }
                __classPrivateFieldGet(this, _BaseComponent_shadowRoot, "f").append((0, createelement_1.h)(renderFunction, props));
            }
        },
        _BaseComponent_shadowRoot = new WeakMap(),
        _a));
}
exports.createCustomElement = createCustomElement;
