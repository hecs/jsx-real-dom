type Child = Element | string | undefined | boolean;

const filterOutBooleanAndObjects = (n: any) => n instanceof Element || !(typeof n === "object" || n == null || typeof n === "boolean");
export const Fragment = "Fragment",
    _h =
        (isSvg = false) =>
        (tagName: string, attrs: { [key: string]: any }, ...children: Child[]): Child | Child[] => {
            if (tagName === Fragment) return children.filter(filterOutBooleanAndObjects);
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
            const toAppend = children.flat(Infinity).filter(filterOutBooleanAndObjects);
            el.append(...(toAppend as (string | Node)[]));
            return el;
        },
    h = _h();
