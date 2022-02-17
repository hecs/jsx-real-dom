import { Fragment, h } from "./createelement";

export function DynamicComponent({ url }) {
    const element = h(Fragment, { url });

    return element;
}
