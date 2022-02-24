import { createBoundComponent } from "./hooks/hooks";

export type Child = Node | string | undefined | boolean;

export const Fragment = "Fragment";

const filterOutBooleanAndObjects = (n: any) =>
    n instanceof Element || !(typeof n === "object" || n == null || typeof n === "boolean");

const getValidChildren = (children): (Node | string)[] =>
    children.flat(Infinity).filter(filterOutBooleanAndObjects);

const attrsKey = "_attrs";

const svg = ["svg", "defs", "rect", "polygon", "path", "g", "line", "text", "circle"];

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
    const [create, setAttr] = svg.includes(tagName)
        ? [
              () => document.createElementNS("http://www.w3.org/2000/svg", tagName),
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
    }

    el.append(...getValidChildren(children));

    return el;
}
