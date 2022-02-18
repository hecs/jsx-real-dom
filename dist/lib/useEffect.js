"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = void 0;
const hooks_1 = require("./hooks");
const compareArray = (a, b) => {
    return JSON.stringify(a) == JSON.stringify(b);
};
function useEffect(callback, values) {
    return (0, hooks_1.getOrCreateHook)((_) => {
        let lastValues;
        return () => {
            if (!compareArray(values, lastValues)) {
                callback();
                lastValues = values;
            }
        };
    });
}
exports.useEffect = useEffect;
