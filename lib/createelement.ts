type Child = Node | string | undefined | boolean;
const flatAndFilter = (children: Child[]) =>
    children.flat(Infinity).filter((n) => n instanceof Node || !(typeof n === "object" || n == null || typeof n === "boolean"));
export const Fragment = "Fragment",
    _h =
        (isSvg = false) =>
        (tagName: string, attrs: { [key: string]: any }, ...children: Child[]): Child | Child[] => {
            if (tagName === Fragment) return flatAndFilter(children);
            const el = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
            if (attrs) {
                for (const [key, val] of Object.entries(attrs)) {
                    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), key);
                    const isReadOnly = !!(descriptor?.get && !descriptor.set);
                    if (!isReadOnly) {
                        el[key] = val;
                    }
                    if (key.startsWith("on")) {
                        el.addEventListener(key.substring(2).toLowerCase(), val, false);
                    } else if (key === "style" && typeof attrs.style !== "string") {
                        Object.assign(el.style, attrs.style);
                    } else if (val !== false && val != null) {
                        el.setAttribute(key, val);
                    }
                }
            }
            const toAppend = flatAndFilter(children);
            el.append(...(toAppend as (string | Node)[]));
            return el;
        },
    h = _h();
