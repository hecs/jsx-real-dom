import Cart from "./components/Cart";
import { createActiveElement } from "../src/lib/createCustomElement";
import { h, Fragment } from "../src/lib/createelement";

const _ctx = {};
const named = (id) => (elm) => {
    _ctx[id] = [...(_ctx[id] || []), elm];
};

const bind =
    (id, fn, ...args) =>
    (e) => {
        const elms = _ctx[id];
        if (elms) {
            elms.forEach((elm) => {
                fn(elm, e, ...args);
            });
        }
    };

const changeContent = (elm, e) => {
    elm.innerHTML = Math.ceil(Math.random() * 1000);
};

const TESTNAME = "kalle";

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

const Slask = () => {
    return (
        <div>
            <ul>
                {items.map((i, index) => (
                    <li ref="listItems">
                        Name: <span>{i.planet}</span>
                        <br></br>
                        Size: <span ref={named(TESTNAME)}>{i.size}</span>
                    </li>
                ))}
            </ul>
            <span ref={named(TESTNAME)}>Lite text</span>
            <span ref={named(TESTNAME)}>annat element</span>
            <button onClick={bind(TESTNAME, changeContent)}>Byt content</button>
        </div>
    );
};

createActiveElement("add-to-cart", ({ sku, cis = 10 }) => <Cart sku={sku} cis={cis} />, [
    "sku",
    "cis",
]);
//hydrate(<Cart {...data} />);
createActiveElement("cc-slask", ({ sku, cis = 10 }) => <Slask sku={sku} cis={cis} />, [
    "sku",
    "cis",
]);
