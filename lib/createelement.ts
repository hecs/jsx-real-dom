import { flattenDeep } from "./flatDeep-polyfill";

type Child = HTMLElement | string | undefined | boolean;

type TagType = string | ((props: any) => HTMLElement);

type StateResult<T> = [T, (T) => void, T];
type HookFunction<T> = () => StateResult<T>;

type HookState = {
    hooks: HookFunction<any>[];
    props: any;
    render: () => void;
};

export const Fragment = "Fragment";

export const Context = <T>(initialValue: T) => {
    let _context = initialValue;
    const getResult = () => {
        return [
            _context,
            (updatedValue: T) => {
                _context = updatedValue;
            },
        ];
    };
    return getResult;
};

let currentCaller;

export function useState<T>(initialValue: T): StateResult<T> {
    if (currentCaller.hookCount < (currentCaller.hooks || []).length) {
        return currentCaller.hooks[currentCaller.hookCount++]();
    }

    let currentValue: T = initialValue;
    const updateFunction = (update: T) => {
        if (currentValue !== update) {
            currentValue = update;
            currentCaller.render();
        }
    };
    const result = (): StateResult<T> => {
        return [currentValue, updateFunction, initialValue];
    };
    currentCaller.hookCount = currentCaller.hooks.push(result);
    return result();
}

const replaceElement = (elm: HTMLElement, updatedElm: HTMLElement) => {
    elm.parentNode.replaceChild(updatedElm, elm);
    return updatedElm;
};

export function h(
    tagName: TagType,
    attrs: { [key: string]: any },
    ...children: Child[]
): Child | Child[] {
    if (typeof tagName === "function") {
        const props = { ...attrs, children };
        let currentElm;

        const caller: HookState = {
            props,
            hooks: [],
            render: () => {
                currentElm = replaceElement(currentElm, render());
            },
        };
        const render = () => {
            currentCaller = caller;
            currentCaller.hookCount = 0;
            return tagName(props);
        };

        currentElm = render();
        return currentElm;
    }
    if (tagName === Fragment) {
        return children;
    }
    const el = document.createElement(tagName);
    if (attrs) {
        Object.assign(el, attrs);
        for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith("on")) {
                el.addEventListener(key.slice(2, key.length).toLowerCase(), val, false);
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
