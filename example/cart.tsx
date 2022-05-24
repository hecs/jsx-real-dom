import Cart from "./components/Cart";
import { createActiveElement } from "../src/lib/createCustomElement";
import { h, Fragment } from "../src/lib/createelement";

createActiveElement("add-to-cart", ({ sku, cis = 10 }) => <Cart sku={sku} cis={cis} />, [
    "sku",
    "cis",
]);
