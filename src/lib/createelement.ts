import { createBoundComponent } from "./hooks/hooks";

export type Child = Node | string | undefined | boolean;

export const Fragment = "Fragment";

const filterOutBooleanAndObjects = (n: any) =>
    n instanceof HTMLElement || !(typeof n === "object" || n == null || typeof n === "boolean");

const getValidChildren = (children): (Node | string)[] =>
    children.flat(Infinity).filter(filterOutBooleanAndObjects);

type PropsWithChildren = { [key:string]:any, children?: Child[] };

export function h(
    tagName: string | ((props: PropsWithChildren) => Child),
    attrs: { [key: string]: any },
    ...children: Child[]
): Child | Child[] {
    if (typeof tagName === "function") {
        return createBoundComponent(tagName, { ...attrs, children });
    }
    if (tagName === Fragment) {
        return getValidChildren(children);
    }
    const el = document.createElement(tagName);
    if (attrs) {
        
        const {ref, list, ...toSet} = attrs;
        if (typeof(ref) === "function") {
            setTimeout(()=>ref(el),0);
            delete attrs.ref;
        }
        if (list)
            el.setAttribute("list", list);
        Object.assign(el, toSet);
        for (const [key, val] of Object.entries(toSet)) {
            if (key.startsWith("on")) {
                el.addEventListener(key.substring(2).toLowerCase(), val, false);
            } else if (key === "dangerouslySetInnerHTML") {
                el.innerHTML = val.__html || "";
            } else if (key === "style" && typeof attrs.style !== "string") {
                Object.assign(el.style, attrs.style);
            } else if (key === "className") {
                el.removeAttribute("className");
            } else if (val !== false && typeof val !== "function") {
                el.setAttribute(key, val);
            }
        }
    }

    el.append(...getValidChildren(children));

    

    return el;
}
