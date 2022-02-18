"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createContext_1 = require("../lib/createContext");
const createCustomElement_1 = require("../lib/createCustomElement");
const createelement_1 = require("../lib/createelement");
const useEffect_1 = require("../lib/useEffect");
const useState_1 = require("../lib/useState");
const BindingTest = () => {
    const [data, setData] = (0, useState_1.useState)("hej");
    const [idx, setIdx] = (0, useState_1.useState)(0);
    const updateValue = (e) => {
        setData(e.target.value);
        setIdx(idx + 1);
    };
    (0, useEffect_1.useEffect)(() => {
        console.log("first load only");
    }, []);
    return ((0, createelement_1.h)("div", null,
        (0, createelement_1.h)("input", { value: data, onChange: updateValue }),
        " data in input ",
        data,
        " ",
        idx));
};
const customContext = (0, createContext_1.createContext)({ contextProperty: "fanta" });
const ContextConsumerTest = () => {
    const { data: { contextProperty }, } = (0, createContext_1.useContext)(customContext);
    return (0, createelement_1.h)("span", null,
        "Context data: ",
        contextProperty);
};
const ContextUpdaterTest = ({ text }) => {
    const { set } = (0, createContext_1.useContext)(customContext);
    return (0, createelement_1.h)("button", { onClick: () => set({ contextProperty: Math.random() * 1000 }) }, text);
};
const CustomBoundElement = ({ text }) => {
    const { data } = (0, createContext_1.useContext)(customContext);
    return ((0, createelement_1.h)("div", null,
        "custom element generator with prop ",
        text,
        ", from context ",
        JSON.stringify(data)));
};
(0, createCustomElement_1.createCustomElement)("slask-elm", CustomBoundElement, (0, createelement_1.h)("style", null, `
					* {
							background-color:blue;
							padding:1rem;
							color:#fff;
					}
			`));
document.body.append((0, createelement_1.h)("div", null,
    (0, createelement_1.h)("div", null,
        (0, createelement_1.h)("p", null, "Custom elements with bound context"),
        (0, createelement_1.h)("slask-elm", { text: "text from property" })),
    (0, createelement_1.h)("div", null,
        (0, createelement_1.h)("p", null, "Regular context consumer"),
        (0, createelement_1.h)(ContextConsumerTest, null)),
    (0, createelement_1.h)("div", null,
        (0, createelement_1.h)("p", null, "State hooks"),
        (0, createelement_1.h)(BindingTest, null)),
    (0, createelement_1.h)("div", null,
        (0, createelement_1.h)("p", null, "Context updater"),
        (0, createelement_1.h)(ContextUpdaterTest, { text: "change context value" }))));
