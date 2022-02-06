type Child = HTMLElement | string | undefined | boolean;

export const Fragment = (props: any) => {
    return props.children as Child[];
}

export function h(
    tagName: string | typeof Fragment,
    attrs: { [key: string]: any },
    ...children: Child[]
): Child[] | Child {
    if (typeof tagName === 'function' && tagName.name === 'Fragment') {
        return children
    }
    const el = document.createElement(tagName as string);
    if (attrs) {
        if (attrs.className) {
            attrs.class = `${attrs.class || ""} ${attrs.className || ""}`;
            delete attrs.className;
        }
        Object.assign(el, attrs);
        for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith("on")) {
                el.addEventListener(key.slice(2, key.length).toLowerCase(), val, false);
            } else if (key === "dangerouslySetInnerHTML") {
                el.innerHTML = val.__html || "";
            } else if (key === "style") {
                if (typeof attrs.style === "string") {
                    el.setAttribute("style", val);
                } else {
                    Object.entries(attrs.style).forEach(([key, val]) => {
                        el.style[key] = val;
                    });
                }
            } else {
                el.setAttribute(key, val);
            }
        }
    }

    const childrenToAppend = children.flat(Infinity).filter((n) => {
        if (n instanceof HTMLElement) return true;
        if (typeof n !== "object" && n != null && n !== false) return true;
        return false;
    });

    el.append(...(childrenToAppend as (string | Node)[]));

    return el;
}


type HTMLElWithRef = HTMLElement & { ref?: string };
export function getRefs(el: HTMLElWithRef | HTMLElWithRef[], refs = {}): { [key: string]: HTMLElement } {
    if (Array.isArray(el)) {
        el.forEach((_e) => getRefs(_e, refs));
        return refs;
    }
    const refKey = el.getAttribute("ref");
    if (refKey) {
        refs[refKey] = el;
    }
    
    Array.from(el.children).forEach((c) => {
        getRefs(c as HTMLElWithRef, refs);
    });
    return refs;
}

