"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DidApp_shadowRoot, _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createelement_1 = require("../lib/createelement");
customElements.define("ce-app", (_a = class DidApp extends HTMLElement {
        constructor() {
            super();
            _DidApp_shadowRoot.set(this, this.attachShadow({ mode: "closed" }));
        }
        connectedCallback() {
            console.info("ce-app connectged Callback");
            __classPrivateFieldGet(this, _DidApp_shadowRoot, "f").append((0, createelement_1.h)("style", null, `
                    :host {color: blue;}
                    ::slotted(*) {
                        color: red;
                      }
                    `), (0, createelement_1.h)("div", { class: "app-root" },
                (0, createelement_1.h)("i", null, "APP Connected"),
                (0, createelement_1.h)("slot", null)));
        }
    },
    _DidApp_shadowRoot = new WeakMap(),
    _a));
