type HTMLElWithRef = HTMLElement & { ref?: string };

const getRefsInternal = (el: Element) =>
    Array.from(el.children).reduce(
        (all, elm) => [...getRefsInternal(elm), ...all],
        (Boolean(el.getAttribute("ref")) ? [el] : []) as Element[]
    );

export const getRefs = (el): { [key: string]: HTMLElWithRef } =>
    getRefsInternal(el).reduce((s, e) => ({ ...s, [e.getAttribute("ref")]: e }), {});
