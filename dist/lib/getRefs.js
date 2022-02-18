"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefs = void 0;
const flatDeep_polyfill_1 = require("./flatDeep-polyfill");
function getRefs(el, refs = {}) {
    if (Array.isArray(el)) {
        el.forEach((_e) => getRefs(_e, refs));
        return refs;
    }
    const refKey = el.getAttribute("ref");
    if (refKey)
        refs[refKey] = refs[refKey] ? (0, flatDeep_polyfill_1.flattenDeep)([refs[refKey], el]) : el;
    Array.from(el.children).forEach((c) => {
        getRefs(c, refs);
    });
    return refs;
}
exports.getRefs = getRefs;
