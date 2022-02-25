import StoreMap from "./components/StoreMap";
import { createActiveElement } from "../src/lib/createCustomElement";
import { h } from "../src/lib/createelement";

const data = {};

createActiveElement("elm-maps", (attrs) => <StoreMap {...data} />, []);
