import Cart from "../components/Cart";
import { createActiveElement } from "../lib/createCustomElement";
import { h, Fragment } from "../lib/createelement";

createActiveElement("add-to-cart", ({ sku, cis = 10 }) => <Cart articleNumber={sku} cis={cis} />, [
    "sku",
]);
//hydrate(<Cart {...data} />);
