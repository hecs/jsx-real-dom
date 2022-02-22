import { h } from "./createelement";
import { contextName } from "./hooks/hooks";

export function createCustomElement(tagName, renderFunction, style?) {
    customElements.define(
        tagName,
        class BaseComponent extends HTMLElement {
            #shadowRoot = this.attachShadow({ mode: "closed" });
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
                let styleElm = style;

                if (typeof style === "function") {
                    styleElm = h(style, props);
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

export function createActiveElement(tagName, renderFunction, watchedProps: string[] = []) {
    customElements.define(
        tagName,
        class BaseComponent extends HTMLElement {
            _context;
            constructor() {
                super();
            }
            getProperties() {
                return this.getAttributeNames().reduce(
                    (all, name) => ({ ...all, [name]: this.getAttribute(name) }),
                    { ...this.dataset } as { [key: string]: any }
                );
            }
            static get observedAttributes() {
                return watchedProps;
            }
            attributeChangedCallback(_, old, updated) {
                if (old !== updated && this._context) {
                    setTimeout(() => {
                        this._context.render(this.getProperties());
                    }, 0);
                }
            }
            connectedCallback() {
                this.innerHTML = "";
                const elm = renderFunction(this.getProperties());
                this._context = elm[contextName];
                this.append(elm as Node);
            }
        }
    );
}
