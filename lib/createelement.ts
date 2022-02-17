import { flattenDeep } from "./flatDeep-polyfill";
import { StateResult } from "./useState";

type Child = HTMLElement | string | undefined | boolean;

type TagType = string | ((props: any) => HTMLElement);

// type HookFunction<T> = () => StateResult<T>;

type HookState = {
    hooks: (() => any)[];
    props: any;
    render: () => void;
    [key: string]: any;
};

export const Fragment = "Fragment";

const replaceElement = (elm: HTMLElement, updatedElm: HTMLElement) => {
    elm.parentNode?.replaceChild(updatedElm, elm);
    return updatedElm;
};

export function h(
    tagName: TagType,
    attrs: { [key: string]: any },
    ...children: Child[]
): Child | Child[] {
    if (typeof tagName === "function") {
        const props = { ...attrs, children };
        let element;
        const caller: HookState = {
            props,
            element,
            hooks: [],
            render: () => {
                element = replaceElement(element, render());
            },
        };
        tagName["_context"] = caller;

        const render = () => {
            caller.hookCount = 0;
            return tagName(props);
        };

        return (element = render());
    }
    if (tagName === Fragment) {
        return children;
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
                Object.entries(attrs.style).forEach(([key, val]) => {
                    el.style[key] = val;
                });
            } else {
                const isBooleanAttributeFalse = val === false;
                if (!isBooleanAttributeFalse) {
                    el.setAttribute(key, val);
                }
            }
        }
    }

    const toAppend = flattenDeep(children).filter((n) => {
        if (n instanceof HTMLElement) return true;
        if (typeof n !== "object" && n != null && n !== false) return true;
        return false;
    });

    el.append(...(toAppend as (string | Node)[]));

    return el;
}
