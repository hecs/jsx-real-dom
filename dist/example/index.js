"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createelement_1 = require("../lib/createelement");
const getRefs_1 = require("../lib/getRefs");
const translate_1 = require("../lib/translate");
require("./did-app");
console.log("hello and welcome");
function clickHandler(e) {
    console.log("click", e);
}
const items = [
    { planet: "Mercury", size: 2.44 },
    { planet: "Venus", size: 6.052 },
    { planet: "Earth", size: 6.371 },
    { planet: "Mars", size: 3.39 },
    { planet: "Jupiter", size: 69.911 },
    { planet: "Saturn", size: 58.232 },
    { planet: "Uranus", size: 25.362 },
    { planet: "Neptune", size: 24.622 },
];
const htmlString = "<b>I'm bold</b>";
const TestComponent = ({ items }) => {
    const elms = items.map((data, idx) => {
        return (0, createelement_1.h)("span", null,
            idx,
            " i komponent");
    });
    return (0, createelement_1.h)("div", null, elms);
};
const t = (0, translate_1.useTranslations)({
    key1: "translated text",
    key2: "other translated text, {{age}} years old",
});
const testar = "hej";
const valueObject = { age: 12 };
const someText = t `key2${valueObject}`;
console.log(t("key2", valueObject));
const html = ((0, createelement_1.h)("div", { ref: "kebab" },
    (0, createelement_1.h)("span", null, "Hello and welcome to the example page."),
    (0, createelement_1.h)("p", null,
        (0, createelement_1.h)("b", null, "T"),
        "est"),
    (0, createelement_1.h)("span", { style: "color: green" }, "Style as string"),
    (0, createelement_1.h)("span", { style: { color: "red" } }, "Style as object"),
    (0, createelement_1.h)("div", { onMouseMove: console.log },
        "This has onMouseMove event ",
        (0, createelement_1.h)("br", null),
        "Buttons",
        ":",
        (0, createelement_1.h)("button", { ref: "pizza", disabled: true, textContent: "Disabled knapp\u2026" }),
        (0, createelement_1.h)("button", { ref: "clickButton", textContent: "Click knapp\u2026", onClick: (e) => clickHandler(e) })),
    (0, createelement_1.h)("ce-app", null,
        (0, createelement_1.h)("div", { class: "insideslot" }, "Inside slot")),
    (0, createelement_1.h)(TestComponent, { items: items }),
    (0, createelement_1.h)("div", { class: "klass" },
        "klass",
        (0, createelement_1.h)("ul", null,
            (0, createelement_1.h)("li", null,
                (0, createelement_1.h)("span", null, someText)))),
    (0, createelement_1.h)("div", { className: "klassname" }, "klassname"),
    (0, createelement_1.h)("ul", null, items.map((i, index) => ((0, createelement_1.h)("li", { ref: "listItems" },
        "Name: ",
        (0, createelement_1.h)("span", { ref: `planet${index}` }, i.planet),
        (0, createelement_1.h)("br", null),
        "Size: ",
        i.size)))),
    (0, createelement_1.h)("div", null,
        "As text: ",
        htmlString),
    (0, createelement_1.h)("div", { dangerouslySetInnerHTML: { __html: htmlString + " < dangerouslySetInnerHTML" } }),
    (0, createelement_1.h)("label", { for: "korv" }, "Label attribute \"for\""),
    (0, createelement_1.h)("input", { id: "korv", "data-plupp": "testar", onChange: (e) => {
            console.log(e.target.dataset);
        } }),
    (0, createelement_1.h)("label", { htmlFor: "korv2" }, "Label property \"htmlFor\""),
    (0, createelement_1.h)("input", { id: "korv2" }),
    (0, createelement_1.h)(createelement_1.Fragment, null,
        (0, createelement_1.h)("div", null, "Inside fragment")),
    (0, createelement_1.h)(createelement_1.Fragment, null,
        (0, createelement_1.h)(createelement_1.Fragment, null,
            (0, createelement_1.h)(createelement_1.Fragment, null,
                (0, createelement_1.h)("div", null,
                    (0, createelement_1.h)(createelement_1.Fragment, null,
                        (0, createelement_1.h)(createelement_1.Fragment, null, "Inside multiple ")))))),
    (0, createelement_1.h)("button", { disabled: false }, "Boolean attributes (disabled=false)"),
    (0, createelement_1.h)("button", { disabled: true }, "Boolean attributes (disabled=true)")));
const refs = (0, getRefs_1.getRefs)(html);
console.log("refs:", refs);
html.style.color = "DarkOrchid";
document.body.append(html);
