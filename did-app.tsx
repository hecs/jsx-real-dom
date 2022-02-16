import { h } from "./lib/createelement";

customElements.define(
    "ce-app",
    class DidApp extends HTMLElement {
        #shadowRoot = this.attachShadow({ mode: "closed" });

        constructor() {
            super();
        }
        connectedCallback() {
            console.info("ce-app connectged Callback");

            this.#shadowRoot.append(
                <style>
                    {`
                    :host {color: blue;}
                    ::slotted(*) {
                        color: red;
                      }
                    `}
                </style>,

                <div class="app-root">
                    <i>APP Connected</i>
                    <slot></slot>
                </div>
            );
        }
    }
);
