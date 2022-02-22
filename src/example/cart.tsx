import Cart from "../components/Cart";
import { createActiveElement } from "../lib/createCustomElement";
import { h, Fragment } from "../lib/createelement";

createActiveElement("add-to-cart", ({ sku, cis = 10 }) => <Cart sku={sku} cis={cis} />, [
    "sku",
    "cis",
]);
//hydrate(<Cart {...data} />);
