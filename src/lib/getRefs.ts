type HTMLElWithRef = HTMLElement & { ref?: string };

const getRefsInternal = (el: Element) => {
    const ref = el.getAttribute("ref");
    return Array.from(el.children).reduce(
        (all, elm) => [...getRefsInternal(elm), ...all],
        Boolean(ref) ? [{ el, ref }] : []
    );
};

export const getRefs = (el): { [key: string]: HTMLElWithRef } =>
    getRefsInternal(el).reduce((s, e) => ({ ...s, [e.ref]: e.el }), {});
