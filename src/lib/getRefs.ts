export type HTMLElWithRef = Element & { ref?: string };

export const getRefsArray = (el: HTMLElWithRef) => {
    const ref = el.ref || el.getAttribute("ref");
    return Array.from(el.children).reduce(
        (all, elm) => [...getRefsArray(elm), ...all],
        Boolean(ref) ? [{ el, ref }] : []
    );
};

export const getRefs = (el: HTMLElWithRef | HTMLElWithRef[]): { [key: string]: HTMLElWithRef } =>
    (Array.isArray(el)
        ? el.reduce((all, i) => [...all, ...getRefsArray(i)], [] as HTMLElWithRef[])
        : getRefsArray(el)
    ).reduce((s, e) => ({ ...s, [e.ref]: e.el }), {});
