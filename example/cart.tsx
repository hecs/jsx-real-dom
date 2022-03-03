import Cart from "./components/Cart";
import { createActiveElement } from "../src/lib/createCustomElement";
import { h, Fragment } from "../src/lib/createelement";
import { getRefs, useState } from "../src";
import { contextName } from "../src/lib/hooks/hooks";
import partialRendering from "../src/lib/hooks/partialRendering";

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

const bindProps = (id, fn, ...args) =>
    bind(
        id,
        (elm, e, ...a) => {
            const { props, render } = elm[contextName];
            setTimeout(() => {
                render(fn(props, e, ...a));
            }, 0);
        },
        ...args
    );

const changeContent = (props) => {
    const planet = Math.ceil(Math.random() * 1000);
    return { ...props, planet };
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

const Kalle = ({ planet, size }) => {
    partialRendering((rootelement, newProps, oldProps) => {
        if (newProps?.planet) {
            rootelement.childNodes[1].innerHTML = newProps.planet;
            return false;
        }
        return true;
    });
    const [i, setI] = useState(0);
    return (
        <li onClick={() => setI(i + 1)} ref={named(TESTNAME)}>
            Name: <span>{planet}</span>
            <br></br>
            I:{i};<br></br>
            Size: <span>{size}</span>
        </li>
    );
};

const Slask = () => {
    return (
        <div>
            <ul>
                {items.map((i, index) => (
                    <Kalle {...i} />
                ))}
            </ul>
            <span ref={named("a")}>Lite text</span>
            <span ref={named("b")}>annat element</span>
            <button onClick={bindProps(TESTNAME, changeContent, "bnajs")}>Byt content</button>
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
