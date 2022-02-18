"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenDeep = void 0;
function flattenDeep(arr) {
    // Polyfill for array.flat(Infinity).
    return arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)), []);
}
exports.flattenDeep = flattenDeep;
