type Child = HTMLElement | string | undefined | boolean;

const filterOutBooleanAndObjects = (n: any) =>
    n instanceof HTMLElement || !(typeof n === "object" || n == null || typeof n === "boolean");

export const Fragment = "Fragment";
export function h(
    tagName: string,
    attrs: { [key: string]: any },
    ...children: Child[]
): Child | Child[] {
    if (tagName === Fragment) {
        return children.filter(filterOutBooleanAndObjects);
    }
    const el = document.createElement(tagName);
    if (attrs) {
        if (tagName === "input") {
            // <input>-list property is read-only´
            for (const key of Object.keys(attrs)) {
                if (key !== "list") el[key] = attrs[key];
            }
        } else {
            Object.assign(el, attrs);
        }
        for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith("on")) {
                el.addEventListener(key.substring(2).toLowerCase(), val, false);
            } else if (key === "style" && typeof attrs.style !== "string") {
                Object.assign(el.style, attrs.style);
            } else {
                const isBooleanAttributeFalse = val === false;
                if (!isBooleanAttributeFalse) {
                    el.setAttribute(key, val);
                }
            }
        }
    }

    const toAppend = children.flat(Infinity).filter(filterOutBooleanAndObjects);
    el.append(...(toAppend as (string | Node)[]));

    return el;
}
