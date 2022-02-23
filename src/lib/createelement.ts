import { createBoundComponent } from "./hooks/hooks";

export type Child = Node | string | undefined | boolean;

export const Fragment = "Fragment";

const filterOutBooleanAndObjects = (n: any) =>
    n instanceof Element || !(typeof n === "object" || n == null || typeof n === "boolean");

const getValidChildren = (children): (Node | string)[] =>
    children.flat(Infinity).filter(filterOutBooleanAndObjects);

const replaceChildren = (el: Element, ns: any, setAttr: any) => {
    const children: any = Array.from(el.children).map((child) => {
        return replaceChildren(child as Element, ns, setAttr);
    });
    if (el instanceof Element) {
        const newElm = document.createElementNS(ns, el.tagName.toLowerCase());
        const attrs = el[attrsKey];
        if (attrs) {
            assignAttributes(newElm, attrs, setAttr);
        }

        if (el.children.length === 0) {
            newElm.innerHTML = el.innerHTML;
        }
        newElm.append(...children);

        return newElm;
    } else {
        console.log("här är det bajs", el);
    }
    return el;
};

const assignAttributes = (el: HTMLElement, attrs: { [key: string]: any }, setAttr) => {
    for (const [key, val] of Object.entries(attrs)) {
        if (key.startsWith("on")) {
            el.addEventListener(key.substring(2).toLowerCase(), val, false);
        } else if (key === "dangerouslySetInnerHTML") {
            el.innerHTML = val.__html || "";
        } else if (key === "style" && typeof attrs.style !== "string") {
            Object.assign(el.style, attrs.style);
        } else if (key === "className") {
            el.removeAttribute("className");
        } else if (val !== false && typeof val !== "function") {
            setAttr(el, key, val); // el.setAttribute(key, val);
        }
    }
};

const attrsKey = "_attrs";

export function h(
    tagName: string | ((props: any) => Child),
    attrs: { [key: string]: any },
    ...children: Child[]
): Child | Child[] {
    if (typeof tagName === "function") {
        return createBoundComponent(tagName, { ...attrs, children });
    }
    if (tagName === Fragment) {
        return getValidChildren(children);
    }
    const [create, setAttr] =
        attrs?.xmlns !== undefined
            ? [
                  () => document.createElementNS(attrs.xmlns, tagName),
                  (el, prop, value) => {
                      if (prop !== "xmlns") {
                          el.setAttributeNS(null, prop, value);
                      }
                  },
              ]
            : [
                  () => {
                      const elm = document.createElement(tagName);
                      Object.assign(elm, attrs || {});
                      elm[attrsKey] = attrs;
                      return elm;
                  },
                  (el, prop, value) => el.setAttribute(prop, value),
              ];

    const el = create();

    if (attrs) {
        assignAttributes(el, attrs, setAttr);
    }

    el.append(...getValidChildren(children));
    if (attrs?.xmlns !== undefined) {
        return replaceChildren(el, attrs.xmlns, setAttr);
    }
    return el;
}
