"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h = exports.Fragment = void 0;
const flatDeep_polyfill_1 = require("./flatDeep-polyfill");
const hooks_1 = require("./hooks");
exports.Fragment = "Fragment";
function h(tagName, attrs, ...children) {
    if (globalThis.ssr !== undefined) {
        globalThis.ssr(tagName, attrs, children);
    }
    if (typeof tagName === "function") {
        return (0, hooks_1.createBoundComponent)(tagName, Object.assign(Object.assign({}, attrs), { children }));
    }
    if (tagName === exports.Fragment) {
        return children;
    }
    const el = document.createElement(tagName);
    if (attrs) {
        Object.assign(el, attrs);
        for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith("on")) {
                el.addEventListener(key.substring(2).toLowerCase(), val, false);
            }
            else if (key === "dangerouslySetInnerHTML") {
                el.innerHTML = val.__html || "";
            }
            else if (key === "style" && typeof attrs.style !== "string") {
                Object.entries(attrs.style).forEach(([key, val]) => {
                    el.style[key] = val;
                });
            }
            else {
                const isBooleanAttributeFalse = val === false;
                if (!isBooleanAttributeFalse) {
                    el.setAttribute(key, val);
                }
            }
        }
    }
    const toAppend = (0, flatDeep_polyfill_1.flattenDeep)(children).filter((n) => {
        if (n instanceof HTMLElement)
            return true;
        if (typeof n !== "object" && n != null && n !== false)
            return true;
        return false;
    });
    el.append(...toAppend);
    return el;
}
exports.h = h;
