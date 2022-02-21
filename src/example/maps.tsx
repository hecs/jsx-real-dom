import StoreMap from "../components/StoreMap";
import { createActiveElement } from "../lib/createCustomElement";
import { h } from "../lib/createelement";

const data = {};

createActiveElement("elm-maps", (attrs) => <StoreMap {...data} />, []);
