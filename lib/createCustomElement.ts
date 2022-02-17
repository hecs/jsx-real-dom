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
                let styleElm;

                if (typeof style === "function") {
                    styleElm = h(style, props);
                } else if (typeof style === "object") {
                    styleElm = style;
                } else if (typeof style === "string") {
                    styleElm = document.createElement("style");
                    styleElm.innerHTML = style;
                }
                if (styleElm !== undefined) {
                    this.#shadowRoot.append(styleElm);
                }
                this.#shadowRoot.append(h(renderFunction, props) as Node);
            }
        }
    );
}
