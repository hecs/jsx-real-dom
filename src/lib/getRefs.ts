type HTMLElWithRef = HTMLElement & { ref?: string };

const getRefsInternal = (el: HTMLElWithRef) => {
    const ref = el.ref || el.getAttribute("ref");
    return Array.from(el.children).reduce(
        (all, elm) => [...getRefsInternal(elm as HTMLElWithRef), ...all],
        Boolean(ref) ? [{ el, ref }] : []
    );
};

export const getRefsArray = (el) => getRefsInternal(el);

export const getRefs = (el: HTMLElWithRef | HTMLElWithRef[]): { [key: string]: HTMLElWithRef } =>
    (Array.isArray(el)
        ? el.reduce((all, i) => [...all, ...getRefsInternal(i)], [] as HTMLElWithRef[])
        : getRefsInternal(el)
    ).reduce((s, e) => ({ ...s, [e.ref]: e.el }), {});
