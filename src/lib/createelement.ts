import { flattenDeep } from "./flatDeep-polyfill";
import { createBoundComponent } from "./hooks/hooks";

type Child = Node | string | undefined | boolean;

export const Fragment = "Fragment";

const filterOutBooleanAndObjects = (n: any) =>
    n instanceof HTMLElement || !(typeof n === "object" || n == null || typeof n === "boolean");

export function h(
    tagName: string | ((props: any) => Node),
    attrs: { [key: string]: any },
    ...children: Child[]
): Child | Child[] {
    if (typeof tagName === "function") {
        return createBoundComponent(tagName, { ...attrs, children });
    }
    if (tagName === Fragment) {
        return children.filter(filterOutBooleanAndObjects);
    }
    const el = document.createElement(tagName);
    if (attrs) {
        Object.assign(el, attrs);
        for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith("on")) {
                el.addEventListener(key.substring(2).toLowerCase(), val, false);
            } else if (key === "dangerouslySetInnerHTML") {
                el.innerHTML = val.__html || "";
            } else if (key === "style" && typeof attrs.style !== "string") {
                Object.assign(el.style, attrs.style);
            } else if (val !== false) {
                el.setAttribute(key, val);
            }
        }
    }

    const toAppend = flattenDeep(children).filter(filterOutBooleanAndObjects);
    el.append(...(toAppend as (string | Node)[]));

    return el;
}
