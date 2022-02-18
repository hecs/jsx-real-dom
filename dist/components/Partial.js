"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createelement_1 = require("../lib/createelement");
const Partial = ({ items }) => {
    const elms = items.map((item) => (0, createelement_1.h)("span", null, item));
    return (0, createelement_1.h)("div", null, elms);
};
exports.default = Partial;
