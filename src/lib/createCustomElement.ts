import { h } from "./createelement";
import { contextName } from "./hooks/hooks";

const getStyleElement = (style, props = {}) => {
    let styleElm = style;
    if (typeof style === "function") {
        styleElm = h("style", { style: style(props) });
    } else if (typeof style === "string") {
        styleElm = document.createElement("style");
        styleElm.innerHTML = style;
    }
    return styleElm;
};

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
                let styleElm = getStyleElement(style);

                if (styleElm !== undefined) {
                    this.#shadowRoot.append(styleElm);
                }
                this.#shadowRoot.append(h(renderFunction, props) as Node);
            }
        }
    );
}

export function createActiveShadowElement(
    tagName,
    renderFunction,
    watchedProps: string[] = [],
    style?
) {
    customElements.define(
        tagName,
        class BaseComponent extends HTMLElement {
            _context;
            _cnt;
            _shadow;
            constructor() {
                super();
                const html = this.innerHTML;
                this._cnt = document.createElement("div");
                this._shadow = this.attachShadow({ mode: "closed" });
                this._shadow.innerHTML = html;
                this._shadow.append(this._cnt);
                const styleElm = getStyleElement(style, {});
                if (styleElm !== undefined) {
                    this._shadow.append(styleElm);
                }
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
                this._cnt.innerHTML = "";
                const elm = renderFunction(this.getProperties());
                this._context = elm[contextName];
                this._cnt.append(elm as Node);
            }
        }
    );
}

export function createActiveElement(tagName, renderFunction, watchedProps: string[] = [], style?) {
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
