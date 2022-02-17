import { h } from "./createelement";

export function createCustomElement(tagName, renderFunction, style?) {
    customElements.define(
        tagName,
        class BaseComponent extends HTMLElement {
            #shadowRoot = this.attachShadow({ mode: "closed" }); //{ mode: "closed" }
            constructor() {
                super();
            }
            getProperties() {
                return this.getAttributeNames().reduce(
                    (all, name) => ({ ...all, [name]: this.getAttribute(name) }),
                    { ...this.dataset } as { [key: string]: any }
                );
            }
            connectedCallback() {
                const props = this.getProperties();
                console.log("alsdj lakshd flakjshdfl", props);
                if (style !== undefined) {
                    this.#shadowRoot.append(h(style, props));
                }
                this.#shadowRoot.append(h(renderFunction, props));
            }
        }
    );
}
