"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslations = void 0;
function useTranslations(input) {
    return (key, props) => {
        let values = input;
        if (typeof input === "function") {
            values = input();
        }
        if (Array.isArray(key)) {
            key = key[0];
        }
        const value = values && values[key];
        if (!value)
            return key;
        if (!props)
            return value;
        return value.replace(/\{\{(.+)\}\}/gi, (s, prop) => {
            const r = props[prop.trim()];
            return r === undefined ? s : r;
        });
    };
}
exports.useTranslations = useTranslations;
