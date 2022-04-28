const flatAndFilter = (children: any[]) =>
    children
        .flat(Infinity)
        .filter((i) => i instanceof Node || typeof i === "string" || typeof i === "number" || i instanceof String || i instanceof Number);
export const Fragment = "Fragment",
    _h =
        (isSvg = false) =>
        (tagName: string, attrs: { [key: string]: any }, ...children: any[]) => {
            if (tagName === Fragment) return flatAndFilter(children);
            const el = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
            if (attrs) {
                for (const [key, val] of Object.entries(attrs)) {
                    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), key);
                    const isReadOnly = !!(descriptor?.get && !descriptor.set);
                    if (!isReadOnly) {
                        el[key] = val;
                    }
                    if (key === "style" && typeof attrs.style !== "string") {
                        Object.assign(el.style, attrs.style);
                    } else if (key.startsWith("on")) {
                        el.addEventListener(key.substring(2).toLowerCase(), val, false);
                    } else if (val !== false && val != null) {
                        el.setAttribute(key, val);
                    }
                }
            }
            el.append(...(flatAndFilter(children) as (Node | string)[]));
            return el;
        },
    h = _h();
